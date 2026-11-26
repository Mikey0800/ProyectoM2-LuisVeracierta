const { Router } = require("express");

const {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost
} = require("../services/posts.service");

const { getAuthorById } = require("../services/authors.service");
const validatePost = require("../middlewares/validatePost");

const router = Router();

// Aquí mueve tus seis rutas de publicaciones.
router.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error al listar publicaciones:", error.message);

    return res.status(500).json({
      error: "No se pudieron obtener las publicaciones"
    });
  }
});

router.get("/author/:authorId", async (req, res) => {
  const authorId = Number(req.params.authorId);

  if (!Number.isInteger(authorId) || authorId <= 0) {
    return res.status(400).json({
      error: "El ID del autor debe ser un entero positivo"
    });
  }

  try {
    const author = await getAuthorById(authorId);

    if (!author) {
      return res.status(404).json({
        error: "Ese autor no existe"
      });
    }

    const posts = await getPostsByAuthor(authorId);

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error al buscar publicaciones:", error.message);

    return res.status(500).json({
      error: "No se pudieron obtener las publicaciones del autor"
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un entero positivo"
    });
  }

  try {
    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: "Esa publicación no existe"
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Error al obtener la publicación:", error.message);

    return res.status(500).json({
      error: "No se pudo obtener la publicación"
    });
  }
});

router.post("/", validatePost, async (req, res) => {
  try {
    const nuevoPost = await createPost(req.body);

    return res.status(201).json(nuevoPost);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        error: "El autor indicado no existe"
      });
    }

    console.error("Error al crear publicación:", error.message);

    return res.status(500).json({
      error: "No se pudo crear la publicación"
    });
  }
});

router.put("/:id", validatePost, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({
      error: "El ID debe ser un entero positivo válido"
    });
  }

  try {
    const postActualizado = await updatePost(id, req.body);

    if (!postActualizado) {
      return res.status(404).json({
        error: "Esa publicación no existe"
      });
    }

    return res.status(200).json(postActualizado);
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        error: "El autor indicado no existe"
      });
    }

    console.error("Error al actualizar publicación:", error.message);

    return res.status(500).json({
      error: "No se pudo actualizar la publicación"
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({
      error: "El ID debe ser un entero positivo válido"
    });
  }

  try {
    const postEliminado = await deletePost(id);

    if (!postEliminado) {
      return res.status(404).json({
        error: "Esa publicación no existe"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar publicación:", error.message);

    return res.status(500).json({
      error: "No se pudo eliminar la publicación"
    });
  }
});

module.exports = router;