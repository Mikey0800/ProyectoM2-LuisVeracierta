const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios

const authors = [
  {
    id: 1,
    name: "Gabriel García Márquez",
    email: "gabo@macondo.com",
    bio: "Escritor y periodista colombiano, ganador del Premio Nobel de Literatura en 1982."
  },
  {
    id: 2,
    name: "Isabel Allende",
    email: "isabel@allende.com",
    bio: "Escritora chilena autora de novelas históricas y realismo mágico como La casa de los espíritus."
  },
  {
    id: 3,
    name: "Julio Cortázar",
    email: "julio@rayuela.com",
    bio: "Escritor y traductor argentino, maestro del relato corto y la prosa poética."
  }
];

app.get("/authors/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ error: "Invalid author ID" });
}

  const author = authors.find((autor) => autor.id === id);

  if (!author){
 return res.status(404).json({
 error : "ese autor no existe"
});
}
res.status(200).json(author);
});
const books = [];



// Endpoint de salud
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});



// 4. Crear un libro


app.post("/books", (req, res) => {
  console.log(req.body);
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }
  
  const newBook = { 
    id: books.length + 1, 
    title 
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});