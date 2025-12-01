import { pool } from "../db/index.js";

export async function getPosts(req, res) {
  const query = `SELECT * FROM posts ORDER BY last_edit_date DESC`
  const [rows] = await pool.query(query);
  res.json(rows);
}

export async function createPost(req, res) {
  console.log(req.body)
  const { title, content, password } = req.body;
  const query = `INSERT INTO posts (title, content, password) VALUES (?, ?, ?)`;
  const [result] = await pool.query(query, [title, content, password]);
  res.json({ success: true, id: result.insertId });
}

export async function getPostById(req, res) {
  const { id } = req.params;
  const query = `SELECT * FROM posts WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  res.json(rows[0]);
}

// 要验证密码
export async function updatePost(req, res) {
  console.log(req.body);
  const { id, title, content } = req.body;
  const query = `UPDATE posts SET title = ?, content = ? WHERE id = ?`;
  await pool.query(query, [title, content, id]);
  res.json({ success: true });
}

// 要验证密码
export async function deletePost(req, res) {
  const { id, password } = req.params;
  const query = `DELETE FROM posts WHERE id = ?`;
  await pool.query(query, [id]);
  res.json({ success: true });
}