const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./user.router");

const PORT = 3000;

const server = express();

mongoose.connect("process.env.MONGODB_URL", { useNewUrlParser: true });

server.use(express.json());
server.use("/api/contacts", usersRouter);

server.use((err, req, res, next) => {
  return res.status(err.status).send(err.message);
});

server.listen(PORT, () => {
  console.log("Server started listening on port", PORT);
});
