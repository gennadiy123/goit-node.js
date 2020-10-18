const express = require("express");
const mongoose = require("mongoose");
const contactRouter = require("./route/contact-route");
const userRouter = require("./route/auth-route");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "/.env") });
const cookieParser = require("cookie-parser");
const multer = require("multer");

const PORT = 3000;

const server = express();

const upload = multer({ dest: "images" });

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () => {
      console.log("Database connection successful");
    },
    (err) => {
      console.log(err);
      process.exit(1);
    }
  );

server.use(express.json());
server.use(cookieParser());
server.use("/contacts", contactRouter);
server.use("/", userRouter);
server.post("/images", upload.single("images"), (req, res, next) => {
  console.log("req.file", req.file);
  console.log("req.body", req.body);
});

server.use((err, req, res, next) => {
  return res.status(err.status).send(err.message);
});

server.listen(PORT, () => {
  console.log("Server started listening on port", PORT);
});
