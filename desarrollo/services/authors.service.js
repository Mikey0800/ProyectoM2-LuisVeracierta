const pool = require("../db/pool");

async function getAllAuthors() {
  const resultado = await pool.query(
    "SELECT * FROM authors ORDER BY id"
  );

  return resultado.rows;
}
async function getAuthorById(id) {
  const resultado = await pool.query(
    "SELECT * FROM authors WHERE id = $1",
    [id]
  );

  return resultado.rows[0];
}

async function createAuthor({ name, email, bio }) {
  const resultado = await pool.query(
    `INSERT INTO authors (name, email, bio)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, bio]
  );

  return resultado.rows[0];
}

async function updateAuthor(id, { name, email, bio }) {
  const resultado = await pool.query(
    `UPDATE authors
     SET name = $1, email = $2, bio = $3
     WHERE id = $4
     RETURNING *`,
    [name, email, bio, id]
  );

  return resultado.rows[0];
}

async function deleteAuthor(id) {
  const resultado = await pool.query(
    "DELETE FROM authors WHERE id = $1 RETURNING id",
    [id]
  );

  return resultado.rows[0];
}

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
