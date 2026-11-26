const express = require("express");

const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);

app.use((req, res) => {
  return res.status(404).json({
    error: "Ruta no encontrada"
  });
});

module.exports = app;