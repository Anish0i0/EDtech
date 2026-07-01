const express = require("express");
const cors = require("cors");
const connectDb = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const noteRoutes = require("./src/routes/noteRoutes");

connectDb();

const app = express();

app.use(express.json());
app.use(cors());

//A simple get route
app.get("/root", (req, res) => {
  res.send("Heyyyyy");
});

app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes);

// Global error handler to surface upload/multer and other errors
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Multer errors (file too large, etc.) may come as MulterError
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  // Validation/fileFilter errors from multer come as generic Error
  if (
    err.message &&
    (err.message.includes("Only PDF") || err.message.includes("File too large"))
  ) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: err.message || "Server error" });
});

//Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
