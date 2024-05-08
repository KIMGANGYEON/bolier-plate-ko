const express = require("express");
const app = express();
const port = 8080;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/hello", (req, res) => {
  res.send("hello~~~");
});

app.post("/api/users/register", async (req, res) => {
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

app.post("/api/users/login", (req, res) => {
  // 이메일이 DB에 있는지 확인
  User.findOne({
    email: req.body.email,
  })
    .then(async (user) => {
      if (!user) {
        throw new Error("제공된 이메일에 해당하는 유저가 없습니다.");
      }
      // 비밀번호가 일치하는지 확인
      const isMatch = await user.comparePassword(req.body.password);
      return { isMatch, user };
    })
    .then(({ isMatch, user }) => {
      console.log(isMatch);
      if (!isMatch) {
        throw new Error("비밀번호가 틀렸습니다.");
      }
      // 로그인 완료
      return user.generateToken();
    })
    .then((user) => {
      // 토큰 저장 (쿠키, localstorage ...)
      return res.cookie("x_auth", user.token).status(200).json({
        loginSuccess: true,
        userId: user._id,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        loginSuccess: false,
        message: err.message,
      });
    });
});

app.get("/api/users/auth", auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      token: "",
    }
  )
    .then(() => {
      return res.status(200).json({
        logoutSuccess: true,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        logoutSuccess: false,
        message: err.message,
      });
    });
});

// User.findOneAndUpdate(
//   { _id: req.user._id },
//   {
//     token: "",
//   },
//   (err, user) => {
//     if (err) return res.join({ success: false, err });
//     return res.status(200).send({
//       success: true,
//     });
//   }
// );

app.listen(port, () => {
  console.log(`✅ Server listenting on port http://localhost:${port} 🔥`);
});
