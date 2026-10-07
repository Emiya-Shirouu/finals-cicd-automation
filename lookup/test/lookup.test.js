// REQUIREMENT 5.1 (bullet 4): automated tests for the lookup module (tests for every backend module).
const test = require("node:test");
const assert = require("node:assert");
const createApp = require("../app");

test("GET /health returns 200", async () => {
  const server = createApp().listen(0);
  const res = await fetch(`http://localhost:${server.address().port}/health`);
  server.close();
  assert.strictEqual(res.status, 200);
});

test("lookup maps Open Library results", async () => {
  const fakeFetch = async () => ({ json: async () => ({ docs: [{ title: "Dune", author_name: ["Frank Herbert"], first_publish_year: 1965 }, { title: "No Author" }] }) });
  const server = createApp(fakeFetch).listen(0);
  const results = await (await fetch(`http://localhost:${server.address().port}/api/lookup?title=dune`)).json();
  server.close();
  assert.deepStrictEqual(results[0], { title: "Dune", author: "Frank Herbert", year: 1965 });
  assert.strictEqual(results[1].author, "Unknown");
});
