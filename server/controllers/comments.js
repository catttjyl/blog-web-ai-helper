import { pool } from "../db/index.js";

export async function getCommentsByPostId(req, res) {
  const postId = req.params.postId;
  const query = `SELECT * FROM comments WHERE post_id = ? ORDER BY comment_date DESC`;
  const [rows] = await pool.query(query, [postId]);
  res.json(rows);
}

export async function addComment(req, res) {
  console.log(req.body);
  const { postId, content } = req.body;
  const query = `INSERT INTO comments (post_id, comment_content) VALUES (?, ?)`;
  await pool.query(query, [postId, content]);
  res.json({ success: true });
}