const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kimgangyeon:abcde12345@cluster0.dmm90qt.mongodb.net",
    {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connect..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
