// REQUIREMENT 5.1 (bullet 4): automated tests for the API module.
// They run in the pipeline with `npm test`.
const test = require("node:test");
const assert = require("node:assert");
const createApp = require("../app");

// Fake in-memory "database" so the tests need no real DB.
function fakeDb(overrides = {}) {
  let books = [], next = 1;
  return {
    ping: async () => {},
    list: async () => books,
    create: async (b) => { const book = { id: next++, ...b }; books.push(book); return book; },
    update: async (id, b) => { const x = books.find((k) => k.id == id); if (x) Object.assign(x, b); return x; },
    remove: async (id) => { books = books.filter((k) => k.id != id); },
    ...overrides,
  };
}

async function withServer(fn, db = fakeDb()) {
  const server = createApp(db).listen(0);
  const base = `http://localhost:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}
const json = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("GET /health returns 200", () => withServer(async (base) => {
  const res = await fetch(base + "/health");
  assert.strictEqual(res.status, 200);
}));

test("GET /health returns 503 when the database is down", () => withServer(async (base) => {
  const res = await fetch(base + "/health");
  assert.strictEqual(res.status, 503);
}, fakeDb({ ping: async () => { throw new Error("db down"); } })));

test("create, read, update and delete a book", () => withServer(async (base) => {
  const createdRes = await fetch(base + "/api/books", json("POST", { title: "T", author: "A", year: "2000" }));
  assert.strictEqual(createdRes.status, 201);
  const created = await createdRes.json();
  assert.strictEqual(created.title, "T");

  let list = await (await fetch(base + "/api/books")).json();
  assert.strictEqual(list.length, 1);

  const updated = await (await fetch(`${base}/api/books/${created.id}`, json("PUT", { title: "New", author: "A", year: "2001" }))).json();
  assert.strictEqual(updated.title, "New");

  await fetch(`${base}/api/books/${created.id}`, { method: "DELETE" });
  list = await (await fetch(base + "/api/books")).json();
  assert.strictEqual(list.length, 0);
}));

test("updating a missing book returns 404", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books/999", json("PUT", { title: "x" }));
  assert.strictEqual(res.status, 404);
}));

test("creating a book without a title returns 400", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books", json("POST", { author: "A" }));
  assert.strictEqual(res.status, 400);
}));

test("creating a book with a blank title returns 400", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books", json("POST", { title: "   " }));
  assert.strictEqual(res.status, 400);
}));

test("updating a book without a title returns 400", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books/1", json("PUT", { author: "A" }));
  assert.strictEqual(res.status, 400);
}));

test("a database failure returns 500 instead of hanging", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books");
  assert.strictEqual(res.status, 500);
}, fakeDb({ list: async () => { throw new Error("db down"); } })));

test("malformed JSON returns 400, not 500", () => withServer(async (base) => {
  const res = await fetch(base + "/api/books", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{not json" });
  assert.strictEqual(res.status, 400);
}));
