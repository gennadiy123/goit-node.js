const { Router } = require("express");
const userRouter = new Router();
const UserModel = require("../model/user-model");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createToken(user) {
  const tokenPayload = { uid: user._id };
  const { JWT_SECRET, JWT_EXIRES_IN } = process.env;

  return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXIRES_IN });
}

function verifyToken(token) {
  const { JWT_SECRET } = process.env;

  return jwt.verify(token, JWT_SECRET);
}

function passwordHash(password, callback) {
  bcrypt.hash(password, 1, function (err, hash) {
    callback(err, hash);
  });
}

function passwordHashCompare(password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

const schema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    tlds: { allow: ["com", "net"] },
  }),
});

userRouter.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const validate = schema.validate({ email, password });
  if (validate.error) {
    return res.status(400).json(validate.error);
  }

  if (await UserModel.existUser(email)) {
    return res.status(409).json({
      message: "Email in use",
    });
  }
  passwordHash(password, async (err, hash) => {
    if (err) {
      return res.status(400).json(err);
    }
    const user = await UserModel.createUser({ email, password: hash });
    return res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  });
});

userRouter.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const validate = schema.validate({ email, password });
  if (validate.error) {
    return res.status(400).json(validate.error);
  }

  const user = await UserModel.getUser(email);
  passwordHashCompare(password, user.password, async (err, result) => {
    if (err) {
      return res.status(400).json(err);
    }
    if (!result) {
      return res.status(401).send("Email or password is wrong");
    }

    const { token: authToken } = await UserModel.updateUser(user._id, {
      token: createToken(user),
    });

    res.cookie("token", authToken, { httpOnly: true });

    return res.status(200).json({
      token: authToken,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  });
});

userRouter.post("/auth/logout", async (req, res) => {
  const { token } = req.cookies;

  try {
    verifyToken(token);
    const user = await UserModel.findByToken(token);
    if (!user) {
      throw "Authorization failed";
    }
    await UserModel.updateUser(user._id, { token: null });
    res.cookie("token", null, { httpOnly: true });

    return res.status(204).send();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
});

userRouter.get("/users/current", async (req, res) => {
  const { token } = req.cookies;

  try {
    verifyToken(token);
    const user = await UserModel.findByToken(token);
    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
});

module.exports = userRouter;
