import express from "express";
import {
  saveMessage,
  getMyChats,
  clearMyChats,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyChats);
router.post("/", protect, saveMessage);
router.delete("/clear", protect, clearMyChats);

export default router;
