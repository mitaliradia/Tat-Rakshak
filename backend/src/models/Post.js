import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    addedBy: {
        type: String, // anonymous or username if logged in
        default: "Anonymous",
    }
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
    },
    comments: [commentSchema] // embedded array of comments
    
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
