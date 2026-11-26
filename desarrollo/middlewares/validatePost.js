function validatePost(req, res, next) {
  const { title, content, author_id, published } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "title es obligatorio y debe ser texto no vacío"
    });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({
      error: "title no puede superar los 200 caracteres"
    });
  }

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({
      error: "content es obligatorio y debe ser texto no vacío"
    });
  }

  if (!Number.isInteger(author_id) || author_id <= 0 ||
      author_id > 2147483647) {
    return res.status(400).json({
      error: "author_id debe ser un entero positivo válido"
    });
  }

  if (published !== undefined && typeof published !== "boolean") {
    return res.status(400).json({
      error: "published debe ser true o false"
    });
  }

  req.body = {
    title: title.trim(),
    content: content.trim(),
    author_id,
    published: published ?? false
  };

  next();
}

module.exports = validatePost;