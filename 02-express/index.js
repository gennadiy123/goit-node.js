const usersRouter = require("./user.router");
const express = require("express");

const PORT = 3000;

const server = express();

server.use(express.json());
server.use('/api/contacts', usersRouter);

server.use((err, req, res, next) => {
  return res.status(err.status).send(err.message);
});

server.listen(PORT, () => {
  console.log("Server started listening on port", PORT);
});