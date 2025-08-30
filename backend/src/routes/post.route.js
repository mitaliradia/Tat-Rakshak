import express from "express";
import { createPost, getPosts, getPostById, addComment } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/", createPost);             // create post
router.get("/", getPosts);                // get all posts
router.get("/:id", getPostById);          // get single post
router.post("/:id/comments", addComment); // add comment

export default router;
