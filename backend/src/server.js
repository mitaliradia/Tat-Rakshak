import express from 'express'
import 'dotenv/config' 

import authRoutes from './routes/auth.route.js'
import postRoutes from "./routes/post.route.js";
import reportRoutes from "./routes/report.route.js";
import {connectDB} from './lib/db.js'

const app = express();
const PORT = process.env.PORT

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reports", reportRoutes);


app.listen(PORT, () => {
    console.log (`app is running on port:  http://localhost:${PORT}`)
    connectDB();
})