const express = require("express");

// fetchFn is passed in so the tests can fake the Open Library call.
module.exports = function createApp(fetchFn = fetch) {
  const app = express();

  // REQUIREMENT 5.1 (bullet 3): health endpoint - GET /health returns HTTP 200.
  app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

  // Look up a book from the external Open Library service.
  app.get("/api/lookup", async (req, res) => {
    const url = "https://openlibrary.org/search.json?limit=5&title=" + encodeURIComponent(req.query.title || "");
    const data = await (await fetchFn(url)).json();
    res.json(data.docs.map((d) => ({
      title: d.title,
      author: d.author_name ? d.author_name[0] : "Unknown",
      year: d.first_publish_year,
    })));
  });

  return app;
};
