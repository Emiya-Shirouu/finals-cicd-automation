CREATE TABLE IF NOT EXISTS books (
  id     SERIAL PRIMARY KEY,
  title  TEXT NOT NULL,
  author TEXT,
  year   TEXT
);
INSERT INTO books (title, author, year) VALUES ('Title 1','Author 1','1000'), ('Title 2','Author 2','1001');
