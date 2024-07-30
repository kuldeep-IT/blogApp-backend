import express from "express";
import { getAllUser, loginUser, signUp } from "../controllers/user-controller.js";

const router = express.Router();

router.get("/", getAllUser)
router.post("/signup", signUp)
router.post("/login", loginUser)

export default router