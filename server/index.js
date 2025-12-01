import express from "express";
import cors from "cors";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import aiHelperRouter from "./routes/ai-helper.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
  res.send('hello');
});
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);
app.use("/ai", aiHelperRouter);

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});