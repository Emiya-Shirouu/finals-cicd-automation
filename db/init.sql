-- Schema for the library database. Runs automatically the FIRST time the
-- database volume is created (docker-entrypoint-initdb.d).
CREATE TABLE IF NOT EXISTS books (
  id         SERIAL PRIMARY KEY,
  title      TEXT      NOT NULL CHECK (btrim(title) <> ''),   -- no empty titles, even if the API is bypassed
  author     TEXT,
  year       TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Seed data: only inserted while the table is empty, so re-running this
-- script never creates duplicates.
INSERT INTO books (title, author, year)
SELECT * FROM (VALUES
  ('Title 1', 'Author 1', '1000'),
  ('Title 2', 'Author 2', '1001')
) AS seed(title, author, year)
WHERE NOT EXISTS (SELECT 1 FROM books);
