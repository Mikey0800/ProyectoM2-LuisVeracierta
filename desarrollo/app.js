const express = require("express");

const authorsRouter = require("./routes/authors.routes");
const postsRouter = require("./routes/posts.routes");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../documentacion/openapi.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.get("/openapi.json", (req, res) => {
  return res.json(openapi);
});

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