const express = require("express");
const app = express();
const port = 8888;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kimgangyeon:abcde12345@cluster0.dmm90qt.mongodb.net/",
    {}
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!!!!");
});

app.listen(port, () => {
  console.log(`✅ Server listenting on port http://localhost:${port}  🔥`);
});
