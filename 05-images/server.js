import express from "express";
import mongoose from "mongoose";
import { contactsRouter } from "./api/contacts/contact.router";
import cookieParser from "cookie-parser";
import { authRouter } from "./api/auth/auth.router";
import multer from "multer";

export class Server {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    await this.initDatabase();
    this.initRoutes();
    this.initErrorHandling();
    this.startListening();
  }

  initServer() {
    this.app = express();
  }

  initMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.static("public"));
  }

  initRoutes() {
    this.app.use("/contacts", contactsRouter);
    this.app.use("/", authRouter);
  }

  async initDatabase() {
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      return res.status(err.status || 500).send(err.message);
    });
  }

  startListening() {
    try {
      const PORT = process.env.PORT;

      this.app.listen(PORT, () => {
        console.log("Database connection successful");
      });
    } catch (err) {
      console.log("error", err);
      process.exit(1);
    }
  }
}
