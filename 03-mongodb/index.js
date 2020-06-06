const express = require("express");
const mongoose = require("mongoose");
const { MONGODB_URL } = require("./.env.json");
const contactSchema = require("./contact-mongoose");
const contactRouter = require("./contact-route");
const PORT = 3000;

const server = express();
const connect = mongoose
  .connect(MONGODB_URL, {
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

const ContactModel = mongoose.model("Contact", contactSchema());

server.use(express.json());
server.use("/", contactRouter(ContactModel));

server.use((err, req, res, next) => {
  return res.status(err.status).send(err.message);
});

