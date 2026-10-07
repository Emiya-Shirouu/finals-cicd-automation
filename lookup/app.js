const express = require("express");

// fetchFn is passed in so the tests can fake the Open Library call.
module.exports = function createApp(fetchFn = fetch) {
  const app = express();

  // REQUIREMENT 5.1 (bullet 3): health endpoint - GET /health returns HTTP 200.
  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

  // Look up a book from the external Open Library service.
  app.get("/api/lookup", async (req, res) => {
    const title = (req.query.title || "").trim();
    if (!title) return res.status(400).json({ message: "title query parameter is required" });

    try {
      const url = "https://openlibrary.org/search.json?limit=5&title=" + encodeURIComponent(title);
      const response = await fetchFn(url);
      if (response.ok === false) throw new Error("Open Library returned " + response.status);
      const data = await response.json();
      if (!data || !Array.isArray(data.docs)) throw new Error("Unexpected response from Open Library");
      res.json(data.docs.map((d) => ({
        title: d.title,
        author: d.author_name ? d.author_name[0] : "Unknown",
        year: d.first_publish_year,
      })));
    } catch (err) {
      console.error(err);
      res.status(502).json({ message: "Lookup service unavailable" });   // bad gateway: upstream failed
    }
  });

  return app;
};
