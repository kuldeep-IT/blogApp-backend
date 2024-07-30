import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";

const app = express();

mongoose.connect("mongodb+srv://rudrax:rudrax@blogcluster0.daprgft.mongodb.net/")
    .then(() => app.listen(5000))
    .then(() => console.log("Server is running on port 5000"))
    .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/user", router)
app.use("/api/blog", blogRouter)

// app.use("/", (req, res, next) => {
//     res.send("Jai Dada Jai Mataji")
// })

// app.listen(5000, () => {
//     console.log("Server is running on port 5000")
// })

//username: rudrax
//password: rudrax
