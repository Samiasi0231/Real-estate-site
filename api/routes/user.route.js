import express from "express";
import { getUsers, getUser, updateUser, deleteUser,savedpost,propfilePosts} from "../controller.js/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Routes
router.get("/", getUsers); 
//router.get("/:id", getUser); 
router.put("/:id", verifyToken, updateUser); 
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savedpost);
router.get("/profilePosts", verifyToken, propfilePosts);

export default router;
