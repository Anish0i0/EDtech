const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");

connectDb();

const app = express();

app.use(express.json());
app.use(cors());

//A simple get route
app.get("/root", (req, res) => {
  res.send("Heyyyyy");
});

app.use("/api/auth", authRoutes);

//Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
