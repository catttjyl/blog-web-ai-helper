import { Router } from "express";
import { generateOutline, contentContinudation, rephraseContent } from "../controllers/ai-helper.js";

const router = Router();

router.post("/outline", generateOutline);
router.post("/continue", contentContinudation);
router.post("/rephrase", rephraseContent);

export default router;