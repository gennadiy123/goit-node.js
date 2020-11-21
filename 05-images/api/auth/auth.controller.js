import Joi, { required } from "@hapi/joi";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../users/users.model";
import { createControllerProxy } from "../helpers/controllerProxy";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, cb) => {
    if (!file.mimetype.includes("image")) {
      const err = new Error();
      err.status = 400;
      return cb(err);
    }

    const { _id: userId } = req.user;
    const name = Date.now();
    const originName = file.originalname;
    const { ext } = path.parse(originName);
    cb(null, `${name}${ext}`);
    const avatarURL = `localhost:3000/images/${name}${ext}`;
    UserModel.updateUser(userId, { avatarURL: `${avatarURL}` });
  },
});

class AuthController {
  constructor() {
    this.upload = multer({ storage });
  }

  async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).send("Email in use");
      }

      const passwordHash = await this.createHash(password);
      const originAvatar = "./tmp/avatar.png";
      const name = Date.now();
      const { ext } = path.parse(originAvatar);

      fs.copyFileSync(originAvatar, `./public/images/${name}${ext}`);

      const avatarURL = `localhost:3000/images/${name}${ext}`;

      const newUser = await UserModel.createUser(
        email,
        passwordHash,
        avatarURL
      );

      return res.status(201).json({
        id: newUser._id,
        email,
        avatarURL,
        subscription: newUser.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }

      const isPasswordValid = await this.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
      }

      const authToken = this.createToken(user);

      await UserModel.updateUser(user._id, { token: authToken });

      res.cookie("token", authToken, { httpOnly: true });

      return res.status(200).json({
        authToken,
        user: {
          email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    const { _id: userId } = req.user;

    await UserModel.updateUser(userId, { token: null });

    res.cookie("token", null, { httpOnly: true });

    return res.status(204).send();
  }

  async current(req, res, next) {
    try {
      const { token } = req.cookies;

      const user = await UserModel.findByToken(token);
      if (!user) {
        res.status(401).send("Not authorized");
      }

      res.status(200).json({
        user: {
          email: user.email,
          subscription: user.subscription,
          avatarURL: user.avatarURL,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  handleUpload(...args) {
    return this.upload.single("avatar").apply(this.upload, [...args]);
  }

  async changeAvatar(req, res, next) {
    try {
      const { token } = req.cookies;

      const user = await UserModel.findByToken(token);
      if (!user) {
        res.status(401).send("Not authorized");
      }

      res.status(200).json({
        avatarURL: user.avatarURL,
      });
    } catch (err) {
      next(err);
    }
  }

  async authorization(req, res, next) {
    try {
      const { token } = req.cookies;

      this.verifyToken(token);

      const user = await UserModel.findByToken(token);
      if (!user) {
        throw new Error("Not authorized");
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(401).send(err.message);
    }
  }

  validateRegister(req, res, next) {
    const newUserParamsSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = newUserParamsSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }

    next();
  }

  validateLogin(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = loginSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }

    next();
  }

  async createHash(password) {
    const BCRYPTJS_SALT_ROUNDS = +process.env.BCRYPTJS_SALT_ROUNDS;
    return bcryptjs.hash(password, BCRYPTJS_SALT_ROUNDS);
  }

  async comparePasswords(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  createToken(user) {
    const tokenPayload = { uid: user._id };
    const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    return jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  verifyToken(token) {
    const { JWT_SECRET } = process.env;

    return jwt.verify(token, JWT_SECRET);
  }
}

export const authController = createControllerProxy(new AuthController());
