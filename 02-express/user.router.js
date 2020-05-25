const { Router } = require("express");
const Joi = require("@hapi/joi");
const uuid = require("uuid");
const contacts = require("./contacts");

const usersDB = require("./db/contacts.json");

const usersRouter = Router();

// C - Create
usersRouter.post("/", validateAddContact, addContact);

// R - Read
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUser);

// U - Update
usersRouter.put("/:id", updateContact);

// D - Delete
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;

function validateAddContact(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}
function addContact(req, res, next) {
  try {
    const contact = contacts.addContact({ ...req.body });
    console.log(contact);
    return res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

function getAllUsers(req, res, next) {
  return res.status(200).json(contacts.listContacts());
}

function getUser(req, res, next) {
  const item = contacts.getContactById(req.params.id);

  if (!item) {
    return res.status(404).send("User not found");
  }
  return res.status(200).json(item);
}

function validateUpdateUser(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
}

function updateContact(req, res, next) {
  try {
    const contact = contacts.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    const output = {};
    for (let key in contact) {
      if (req.body[key] && contact[key].toString() !== req.body[key]) {
        output[key] = req.body[key];
      }
    }
    contacts.updateContact(contact, { ...output });
    const fields = Object.keys(output);
    if (fields.length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }
    return res.status(200).json(output);
  } catch (err) {
    console.log(err);
  }
}

function deleteUser(req, res, next) {
  try {
    const contact = contacts.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    contacts.removeContact(contact);
    return res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
}

function findUserIndex(id) {
  const userIndexFound = usersDB.findIndex((user) => user.id === req.params.id);
  if (userIndexFound === -1) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return userIndexFound;
}
