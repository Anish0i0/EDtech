const express = require("express");
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getNoteById,
  summarizeNote,
} = require("../controllers/noteController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", protect, upload.single("file"), uploadNote);
router.get("/", protect, getNotes);
router.get("/:id", protect, getNoteById);
router.post("/:id/summarize", protect, summarizeNote); // ← new route

module.exports = router;
