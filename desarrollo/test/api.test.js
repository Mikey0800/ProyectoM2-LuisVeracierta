const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../app");
const pool = require("../db/pool");
const { getAuthorById } = require("../services/authors.service");

const author = {
  id: 101,
  name: "Ana",
  email: "ana.test@example.com",
  bio: null,
  created_at: "2026-11-25T12:00:00.000Z"
};

const post = {
  id: 201,
  title: "Publicación de prueba",
  content: "Contenido de prueba",
  author_id: 101,
  published: false,
  created_at: "2026-11-25T12:00:00.000Z"
};

// Cierra el pool cuando termina toda la suite.
after(async () => {
  await pool.end();
});

test("El servicio busca un autor con un parámetro SQL", async (t) => {
  t.mock.method(pool, "query", async (sql, values) => {
    assert.match(sql, /WHERE id = \$1/);
    assert.deepEqual(values, [101]);

    return { rows: [author] };
  });

  const resultado = await getAuthorById(101);

  assert.equal(resultado.id, 101);
  assert.equal(resultado.name, "Ana");
});

test("POST /authors crea un autor y responde 201", async (t) => {
  t.mock.method(pool, "query", async (sql, values) => {
    assert.match(sql, /INSERT INTO authors/);
    assert.deepEqual(values, ["Ana", "ana.test@example.com", null]);

    return { rows: [author] };
  });

  const respuesta = await request(app)
    .post("/authors")
    .send({
      name: " Ana ",
      email: "ana.test@example.com"
    });

  assert.equal(respuesta.status, 201);
  assert.equal(respuesta.body.id, 101);
  assert.equal(respuesta.body.name, "Ana");
});

test("GET /authors/:id devuelve un autor como objeto", async (t) => {
  t.mock.method(pool, "query", async () => ({
    rows: [author]
  }));

  const respuesta = await request(app).get("/authors/101");

  assert.equal(respuesta.status, 200);
  assert.equal(respuesta.body.id, 101);
  assert.equal(Array.isArray(respuesta.body), false);
});

test("POST /posts crea una publicación con published false por defecto", async (t) => {
  t.mock.method(pool, "query", async (sql, values) => {
    assert.match(sql, /INSERT INTO posts/);
    assert.deepEqual(values, [
      "Publicación de prueba",
      "Contenido de prueba",
      101,
      false
    ]);

    return { rows: [post] };
  });

  const respuesta = await request(app)
    .post("/posts")
    .send({
      title: "Publicación de prueba",
      content: "Contenido de prueba",
      author_id: 101
    });

  assert.equal(respuesta.status, 201);
  assert.equal(respuesta.body.id, 201);
  assert.equal(respuesta.body.published, false);
});

test("DELETE de una publicación inexistente responde 404", async (t) => {
  t.mock.method(pool, "query", async () => ({
    rows: []
  }));

  const respuesta = await request(app).delete("/posts/999");

  assert.equal(respuesta.status, 404);
  assert.equal(typeof respuesta.body.error, "string");
});

test("POST /authors rechaza un nombre vacío antes de consultar SQL", async (t) => {
  t.mock.method(pool, "query", async () => {
    assert.fail("No debería consultar la base con datos inválidos");
  });

  const respuesta = await request(app)
    .post("/authors")
    .send({
      name: "   ",
      email: "ana.test@example.com"
    });

  assert.equal(respuesta.status, 400);
});

test("GET /authors/:id rechaza un ID inválido antes de consultar SQL", async (t) => {
  t.mock.method(pool, "query", async () => {
    assert.fail("No debería consultar la base con un ID inválido");
  });

  const respuesta = await request(app).get("/authors/abc");

  assert.equal(respuesta.status, 400);
});

test("POST /authors transforma un email duplicado en respuesta 400", async (t) => {
  t.mock.method(pool, "query", async () => {
    const error = new Error("Email duplicado");
    error.code = "23505";
    throw error;
  });

  const respuesta = await request(app)
    .post("/authors")
    .send({
      name: "Ana",
      email: "ana.test@example.com"
    });

  assert.equal(respuesta.status, 400);
  assert.equal(typeof respuesta.body.error, "string");
});