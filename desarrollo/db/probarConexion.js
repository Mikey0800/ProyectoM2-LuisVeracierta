const pool = require("./pool");

async function probarConexion() {
  try {
    const resultado = await pool.query(
      "SELECT id, name FROM authors ORDER BY id"
    );

    console.table(resultado.rows);
  } catch (error) {
    console.error("Error al consultar PostgreSQL:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

probarConexion();