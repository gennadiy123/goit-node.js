const { Router } = require("express");
const Joi = require("@hapi/joi");
const uuid = require("uuid");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectId")(Joi);
const contacts = require("./contacts");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  subscription: { type: String },
  password: { type: String, required: true },
  token: {},
});

// userSchema.statics.addContact = addContact;

const ContactModel = mongoose.model("Contact", contactSchema);

// async function addContact(req, res, next) {
//   return this.create(req, res, next);
// }

// const usersDB = require("./db/contacts.json");

const usersRouter = Router();

// C - Create
usersRouter.post("/", validateAddContact, addContact);

// R - Read
usersRouter.get("/", getAllContacts);
usersRouter.get("/:id", validateGetContactById, getContactById);

// U - Update
usersRouter.put("/:id", validateUpdateContact, updateContact);

// D - Delete
usersRouter.delete("/:id", validateRemoveContact, removeContact);

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

async function addContact(req, res, next) {
  try {
    const contact = await contacts.addContact({ ...req.body });
    console.log(contact);
    return res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

async function getAllContacts(req, res, next) {
  return res.status(200).json(await contacts.listContacts());
}

function validateGetContactById(req, res, next) {
  const toValidate = {
    params: req.params,
  };

  const userRules = Joi.object({
    params: { id: Joi.objectId() },
  });

  const validationResult = userRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

async function getContactById(req, res, next) {
  const item = await ContactModel.getContactById(req.params.id);

  if (!item) {
    return res.status(404).send("User not found");
  }
  return res.status(200).json(item);
}

function validateUpdateContact(req, res, next) {
  const toValidate = {
    body: req.body,
    params: req.params,
  };

  const userRules = Joi.object({
    body: { name: Joi.string(), email: Joi.string() },
    params: { id: Joi.objectId() },
  });

  const validationResult = userRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
}

async function updateContact(req, res, next) {
  try {
    const contact = await contacts.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    const output = await {};
    for (let key in contact) {
      if (req.body[key] && contact[key].toString() !== req.body[key]) {
        output[key] = req.body[key];
      }
    }
    contacts.updateContact(contact, { ...output });
    const fields = await Object.keys(output);
    if (fields.length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }
    return res.status(200).json(output);
  } catch (err) {
    console.log(err);
  }
}

function validateRemoveContact(req, res, next) {
  const toValidate = {
    params: req.params,
  };

  const userRules = Joi.object({
    params: { id: Joi.objectId() },
  });

  const validationResult = userRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

async function removeContact(req, res, next) {
  try {
    const contact = await contacts.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    contacts.removeContact(contact);
    return res.status(200).json({ message: "contact deleted" });
  } catch (err) {
    next(err);
  }
}

// exports.getContactById = async function getContactById(id) {
//   const userIndexFound = await usersDB.findIndex((user) => user.id === req.params.id);
//   if (userIndexFound === -1) {
//     const err = new Error("User not found");
//     err.status = 404;
//     throw err;
//   }
//   return userIndexFound;
// }
