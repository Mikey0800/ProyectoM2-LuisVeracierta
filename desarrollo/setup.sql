-- ============================================================================
-- SETUP: Creacion de esquema y tablas
-- ============================================================================

-- Crear tabla de autores
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de posts
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- ============================================================================
-- SEED: Datos de ejemplo
-- ============================================================================

-- Insertar autores (no duplica si el email ya existe)
INSERT INTO authors (name, email, bio) VALUES
    ('Ana García',  'ana@example.com',    'Desarrolladora full-stack apasionada por Node.js'),
    ('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
    ('María López', 'maria@example.com',  'Ingeniera de software con foco en APIs REST')
ON CONFLICT (email) DO NOTHING;

-- Insertar posts buscando el autor por email (no depende de los ids generados)
-- y evitando duplicados si el script se ejecuta más de una vez
INSERT INTO posts (title, content, author_id, published)
SELECT p.title, p.content, a.id, p.published
FROM (VALUES
    ('Introducción a Node.js',       'Node.js es un runtime de JavaScript...',          'ana@example.com',    TRUE),
    ('PostgreSQL vs MySQL',          'Ambas bases de datos tienen ventajas...',         'carlos@example.com', TRUE),
    ('APIs RESTful',                 'REST es un estilo arquitectónico...',             'ana@example.com',    TRUE),
    ('Manejo de errores en Express', 'El manejo apropiado de errores...',               'maria@example.com',  FALSE),
    ('Async/Await explicado',        'Las promesas simplifican el código asíncrono...', 'ana@example.com',    FALSE)
) AS p(title, content, author_email, published)
JOIN authors a ON a.email = p.author_email
WHERE NOT EXISTS (
    SELECT 1 FROM posts x
    WHERE x.title = p.title AND x.author_id = a.id
);