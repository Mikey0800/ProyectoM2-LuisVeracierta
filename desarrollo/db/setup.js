const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("./pool");

async function setup() {
  try {
    const archivo = path.join(__dirname, "..", "setup.sql");
    const sql = await fs.readFile(archivo, "utf8");

    await pool.query(sql);

    console.log("Tablas y datos iniciales preparados correctamente");
  } catch (error) {
    console.error("Error al preparar la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setup();