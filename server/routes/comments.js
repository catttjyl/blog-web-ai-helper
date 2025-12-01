import { Router } from "express";
import { getCommentsByPostId, addComment } from "../controllers/comments.js";

const router = Router();

router.get("/:postId", getCommentsByPostId);
router.post("/:postId", addComment);

export default router;