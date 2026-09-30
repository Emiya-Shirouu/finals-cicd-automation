const express = require("express");

// The database is passed in so the tests can use a fake one.
module.exports = function createApp(db) {
  const app = express();
  app.use(express.json());

  // REQUIREMENT 5.1 (bullet 3): health endpoint - GET /health returns HTTP 200.
  // Used by Docker health checks and the smoke test.
  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

  // READ - get all books (reads from the database)
  app.get("/api/books", async (req, res) => res.json(await db.list()));

  // CREATE - add a book (writes to the database)
  app.post("/api/books", async (req, res) => res.json(await db.create(req.body)));

  // UPDATE - edit a book (writes to the database)
  app.put("/api/books/:id", async (req, res) => {
    const book = await db.update(req.params.id, req.body);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

  // DELETE - remove a book (writes to the database)
  app.delete("/api/books/:id", async (req, res) => {
    await db.remove(req.params.id);
    res.json({ message: "Book deleted" });
  });

  return app;
};
