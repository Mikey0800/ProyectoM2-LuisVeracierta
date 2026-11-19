const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Datos en memoria (Array inicial)
let productos = [
  { id: 1, nombre: 'Teclado Mecánico', precio: 85 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 40 }
];
let siguienteId = 3;

// 1. GET - Obtener todos los elementos
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

// 2. GET - Obtener un elemento por su ID
app.get('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
  res.json(producto);
});

// 3. POST - Crear un nuevo elemento
app.post('/api/productos', (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({ mensaje: 'El nombre y el precio son obligatorios' });
  }

  const nuevoProducto = {
    id: siguienteId++,
    nombre,
    precio
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// 4. PUT - Actualizar un elemento existente
app.put('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  const { nombre, precio } = req.body;
  productos[index] = {
    ...productos[index],
    nombre: nombre ?? productos[index].nombre,
    precio: precio ?? productos[index].precio
  };

  res.json(productos[index]);
});

// 5. DELETE - Eliminar un elemento
app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Producto no encontrado' });
  }

  productos.splice(index, 1);
  res.status(204).send();
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});