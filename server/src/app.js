const express = require("express");
const app = express();

//A simple get route
app.get("/root", (req, res) => {
  res.send("Heyyyyy");
});

//Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
