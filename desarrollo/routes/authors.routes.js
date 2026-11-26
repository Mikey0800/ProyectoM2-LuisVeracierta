const { Router } = require("express");

const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} = require("../services/authors.service");

const router = Router();

// Aquí mueve tus cinco rutas de autores.
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ error: "Invalid author ID" });
}

try {
  const author = await getAuthorById(id);

  if (!author){
 return res.status(404).json({
 error : "ese autor no existe"
});
}
res.status(200).json(author);
} catch (error) {
    console.error("Error al obtener el autor:", error.message);
    return res.status(500).json({
      error: "No se pudo obtener el autor"
    });
  }
}); // Cierra la función y la llamada a app.get().

router.get("/", async (req, res) => {
  try {
    const listaAutores = await getAllAuthors();

    return res.status(200).json(listaAutores);
  } catch (error) {
    console.error("Error al listar autores:", error.message);

    return res.status(500).json({
      error: "No se pudieron obtener los autores"
    });
  }
});

router.post("/", async (req, res) => {
  const { name, email, bio } = req.body || {};

  // 1. Validar el nombre.
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "name es obligatorio y debe ser texto no vacío"
    });
  }

   // 2. Validar el email.
  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      error: "email es obligatorio y debe ser texto no vacío"
    });
  }
 
 try {
  const nuevoAutor = await createAuthor({
    name: name.trim(),
    email: email.trim(),
    bio: bio ?? null
  });

  return res.status(201).json(nuevoAutor);
} catch (error) {
  if (error.code === "23505") {
    return res.status(400).json({
      error: "Ese email ya está registrado"
    });
  }

  console.error("Error al crear el autor:", error.message);

  return res.status(500).json({
    error: "No se pudo crear el autor"
  });
}
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, bio } = req.body || {};

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un entero positivo"
    });
  }

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "name es obligatorio y debe ser texto no vacío"
    });
  }

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      error: "email es obligatorio y debe ser texto no vacío"
    });
  }

  try {
    const autorActualizado = await updateAuthor(id, {
      name: name.trim(),
      email: email.trim(),
      bio: bio ?? null
    });

    if (!autorActualizado) {
      return res.status(404).json({
        error: "Ese autor no existe"
      });
    }

    return res.status(200).json(autorActualizado);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Ese email ya está registrado"
      });
    }

    console.error("Error al actualizar el autor:", error.message);

    return res.status(500).json({
      error: "No se pudo actualizar el autor"
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un entero positivo"
    });
  }

  try {
    const autorEliminado = await deleteAuthor(id);

    if (!autorEliminado) {
      return res.status(404).json({
        error: "Ese autor no existe"
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el autor:", error.message);

    return res.status(500).json({
      error: "No se pudo eliminar el autor"
    });
  }
});

module.exports = router;