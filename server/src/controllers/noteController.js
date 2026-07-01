const Note = require("../models/Note");
const extractTextFromPDF = require("../services/pdfService");
const generateSummary = require("../services/geminiService");

// POST /api/notes/upload
const uploadNote = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const fileUrl = req.file.path;

    // NEW: Extract text from the uploaded PDF
    console.log("Extracting text from PDF...");
    const extractedText = await extractTextFromPDF(fileUrl);
    console.log("Text extracted! Length:", extractedText.length);

    // Save note with extracted text
    const note = new Note({
      title,
      fileUrl,
      extractedText, // ← now filled with real text
      summary: "", // still empty, Day 6 fills this with AI
      userId: req.user._id,
    });

    await note.save();

    res.status(201).json({
      message: "Upload successful",
      fileUrl: note.fileUrl,
      noteId: note._id,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/notes/:id  (stretch goal)
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Security check: make sure this note belongs to the logged in user
    if (note.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this note" });
    }

    res.status(200).json({
      title: note.title,
      fileUrl: note.fileUrl,
      extractedText: note.extractedText,
      summary: note.summary,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const summarizeNote = async (req, res) => {
  try {
    // Step 1: Get note by ID
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Step 2: Verify owner
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Step 3: Check extractedText exists
    if (!note.extractedText || note.extractedText.trim() === "") {
      return res
        .status(400)
        .json({ message: "No text found in this note to summarize" });
    }

    // Step 4: Call Gemini
    console.log("Generating summary with Gemini...");
    const summary = await generateSummary(note.extractedText);
    console.log("Summary generated!");

    // Step 5: Update summary field in MongoDB
    note.summary = summary;
    await note.save();

    // Step 6: Return summary
    res.status(200).json({
      message: "Summary generated successfully",
      summary: note.summary,
    });
  } catch (error) {
    console.log("SUMMARIZE ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadNote, getNotes, getNoteById, summarizeNote };
