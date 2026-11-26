const pool = require("../db/pool");

async function getAllPosts() {
  const resultado = await pool.query(
    "SELECT * FROM posts ORDER BY id"
  );

  return resultado.rows;
}

async function getPostById(id) {
  const resultado = await pool.query(
    "SELECT * FROM posts WHERE id = $1",
    [id]
  );

  return resultado.rows[0];
}

async function getPostsByAuthor(authorId) {
  const resultado = await pool.query(
    `SELECT
       p.*,
       json_build_object(
         'id', a.id,
         'name', a.name,
         'email', a.email,
         'bio', a.bio,
         'created_at', a.created_at
       ) AS author
     FROM posts p
     JOIN authors a ON a.id = p.author_id
     WHERE p.author_id = $1
     ORDER BY p.id`,
    [authorId]
  );

  return resultado.rows;
}

async function createPost({ title, content, author_id, published }) {
  const resultado = await pool.query(
    `INSERT INTO posts (title, content, author_id, published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, content, author_id, published]
  );

  return resultado.rows[0];
}

async function updatePost(id, { title, content, author_id, published }) {
  const resultado = await pool.query(
    `UPDATE posts
     SET title = $1, content = $2, author_id = $3, published = $4
     WHERE id = $5
     RETURNING *`,
    [title, content, author_id, published, id]
  );

  return resultado.rows[0];
}

async function deletePost(id) {
  const resultado = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING id",
    [id]
  );

  return resultado.rows[0];
}

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost
};