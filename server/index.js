const express = require("express");
const app = express();
const port = 8080;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const { Video } = require("./models/Video");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfprobePath("/path/to/ffprobe");

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

//async await
// app.post("/api/users/login", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       throw new Error("제공된 이메일에 해당하는 유저가 없습니다.");
//     }

//     const isMatch = await user.comparePassword(req.body.password);
//     if (!isMatch) {
//       throw new Error("비밀번호가 틀렸습니다.");
//     }

//     const token = await user.generateToken();
//     res.cookie("x_auth", token).status(200).json({
//       loginSuccess: true,
//       userId: user._id,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       loginSuccess: false,
//       message: err.message,
//     });
//   }
// });

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

let storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "uploads/");
  },
  filename: (req, file, cd) => {
    cd(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cd) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".mp4") {
      return cd(res.status(400).end("only mp4 is allowed"), false);
    }
    cd(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

app.post("/api/video/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

app.post("/api/video/thumbnail", (req, res) => {
  let filePath = "";
  let fileDuration = "";

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    if (err) {
      console.error("Error getting video metadata:", err);
      return res.json({ success: false, err });
    }

    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;

    //썸네일 생성
    ffmpeg(req.body.url)
      .on("filenames", function (filenames) {
        console.log("Will generate" + filenames.join(", "));
        console.log(filenames);
        filePath = "uploads/thumbnails/" + filenames[0];
        console.log(filePath);
      })
      .on("end", function () {
        console.log("Screenshots taken");
        return res.json({
          success: true,
          url: filePath,
          fileDuration: fileDuration,
        });
      })
      .on("error", function (err) {
        console.error("Error generating thumbnails:", err);
        return res.json({ success: false, err });
      })
      .screenshots({
        count: 3,
        folder: "uploads/thumbnails",
        size: "320x240",
        filename: "thumbnail-%b.jpeg",
      });
  });
});

app.post("/api/video/uploadVideo", async (req, res) => {
  const video = new Video(req.body);

  try {
    await video.save();
    return res.status(200).json({ success: true });
  } catch {
    return res.json({ success: false, err });
  }
});

app.get("/api/video/getVideos", async (req, res) => {
  try {
    const videos = await Video.find().populate("writer").exec();
    res.status(200).json({ success: true, videos });
  } catch {
    res.status(400).send(err);
  }
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
