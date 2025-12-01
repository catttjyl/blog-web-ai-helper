import { Router } from "express";
import { getPosts, createPost, getPostById, updatePost } from "../controllers/posts.js";

const router = Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:id", getPostById);
router.post("/:id", updatePost);

export default router;
