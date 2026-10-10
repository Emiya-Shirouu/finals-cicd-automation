// REQUIREMENT 5.1 (bullet 4): automated tests for the lookup module (tests for every backend module).
const test = require("node:test");
const assert = require("node:assert");
const createApp = require("../app");

async function get(app, path) {
  const server = app.listen(0);
  try {
    return await fetch(`http://localhost:${server.address().port}${path}`);
  } finally {
    server.close();
  }
}

test("GET /health returns 200", async () => {
  const res = await get(createApp(), "/health");
  assert.strictEqual(res.status, 200);
});

test("lookup maps Open Library results", async () => {
  const fakeFetch = async () => ({ json: async () => ({ docs: [{ title: "Dune", author_name: ["Frank Herbert"], first_publish_year: 1965 }, { title: "No Author" }] }) });
  const results = await (await get(createApp(fakeFetch), "/api/lookup?title=dune")).json();
  assert.deepStrictEqual(results[0], { title: "Dune", author: "Frank Herbert", year: 1965 });
  assert.strictEqual(results[1].author, "Unknown");
});

test("lookup without a title returns 400", async () => {
  const res = await get(createApp(), "/api/lookup");
  assert.strictEqual(res.status, 400);
});

test("lookup returns 502 when Open Library is unreachable", async () => {
  const failingFetch = async () => { throw new Error("network down"); };
  const res = await get(createApp(failingFetch), "/api/lookup?title=dune");
  assert.strictEqual(res.status, 502);
});

test("lookup returns 502 when Open Library sends an unexpected response", async () => {
  const badFetch = async () => ({ ok: true, json: async () => ({ nothing: true }) });
  const res = await get(createApp(badFetch), "/api/lookup?title=dune");
  assert.strictEqual(res.status, 502);
});
