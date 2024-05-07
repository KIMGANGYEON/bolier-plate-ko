const express = require("express");
const app = express();
const port = 8888;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/register", async (req, res) => {
  //회원 가입 할때 필요한 정포들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);

  try {
    await user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.listen(port, () => {
  console.log(`✅ Server listenting on port http://localhost:${port} 🔥`);
});
