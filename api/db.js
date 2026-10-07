// REQUIREMENT 5.1 (bullet 2): this module READS from and WRITES to a real
// database (PostgreSQL) instead of a JSON file.
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

exports.list = async () => (await pool.query("SELECT * FROM books ORDER BY id")).rows;              // READ

exports.create = async ({ title, author, year }) =>                                                 // WRITE
  (await pool.query("INSERT INTO books (title, author, year) VALUES ($1,$2,$3) RETURNING *", [title, author, year])).rows[0];

exports.update = async (id, { title, author, year }) =>                                             // WRITE
  (await pool.query("UPDATE books SET title=$2, author=$3, year=$4 WHERE id=$1 RETURNING *", [id, title, author, year])).rows[0];

exports.remove = async (id) => { await pool.query("DELETE FROM books WHERE id=$1", [id]); };        // WRITE
