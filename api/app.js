const express = require("express");

// The database is passed in so the tests can use a fake one.
module.exports = function createApp(db) {
  const app = express();
  app.use(express.json());

  // REQUIREMENT 5.1 (bullet 3): health endpoint - GET /health returns HTTP 200.
  // Used by Docker health checks and the smoke test.
  // It also checks the database: if the DB is unreachable it returns 503.
  app.get("/health", async (req, res) => {
    try {
      if (db.ping) await db.ping();
      res.status(200).json({ status: "ok" });
    } catch (err) {
      res.status(503).json({ status: "unavailable", message: "Database unreachable" });
    }
  });

  // Reject a book without a usable title (400 Bad Request).
  const validateBook = (req, res, next) => {
    const title = req.body && req.body.title;
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    next();
  };

  // READ - get all books (reads from the database)
  app.get("/api/books", async (req, res) => res.json(await db.list()));

  // CREATE - add a book (writes to the database)
  app.post("/api/books", validateBook, async (req, res) => res.status(201).json(await db.create(req.body)));

  // UPDATE - edit a book (writes to the database)
  app.put("/api/books/:id", validateBook, async (req, res) => {
    const book = await db.update(req.params.id, req.body);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

  // DELETE - remove a book (writes to the database)
  app.delete("/api/books/:id", async (req, res) => {
    await db.remove(req.params.id);
    res.json({ message: "Book deleted" });
  });

  // Error handler: Express 5 forwards errors from async routes here,
  // so a database failure returns a clean 500 instead of hanging the request.
  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    // Client mistakes (for example malformed JSON) keep their 4xx status; everything else is a 500.
    const status = err.status >= 400 && err.status < 500 ? err.status : 500;
    res.status(status).json({ message: status === 500 ? "Internal server error" : "Bad request" });
  });

  return app;
};
