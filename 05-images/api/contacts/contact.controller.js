import Joi from "@hapi/joi";
import { ContactModel } from "./contact.model";
import { NotFound } from "../helpers/errorConstructors";

Joi.objectId = require("joi-objectid")(Joi);

export const validateCreateContact = function validateCreateContact(req, res, next) {
  const body = req.body;

  const contactRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.number().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string().required(),
  });

  const validationResult = contactRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

export const createContact = async function createContact(req, res, next) {
  try {
    const createdContact = await ContactModel.createContact(req.body);

    return res.status(201).json(createdContact);
  } catch (err) {
    next(err);
  }
};

export const getAllContacts = async function getAllContacts(req, res, next) {
  return res.status(200).json(await ContactModel.getAllContacts());
};

export const validateGetContact = function validateGetContact(req, res, next) {
  const toValidate = {
    params: req.params,
  };

  const contactRules = Joi.object({
    params: { id: Joi.objectId() },
  });
  const validationResult = contactRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

export const getContact = async function getContact(req, res, next) {
  try {
    const contactFound = await ContactModel.getContact(req.params.id);
    if (!contactFound) {
      throw new NotFound("Contact not found");
    }

    return res.status(200).json(contactFound);
  } catch (err) {
    next(err);
  }
};

export const validateUpdateContact = function validateUpdateContact(req, res, next) {
  const toValidate = {
    body: req.body,
    params: req.params,
  };

  const contactRules = Joi.object({
    body: {
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.number(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    },
    params: { id: Joi.objectId() },
  });

  const validationResult = contactRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

export const updateContact = async function updateContact(req, res, next) {
  try {
    const updatedContact = await ContactModel.updateContact(
      req.params.id,
      req.body
    );
    if (!updatedContact) {
      throw new NotFound("Contact not found");
    }

    return res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};

export const validateDeleteContact = function validateDeleteContact(req, res, next) {
  const toValidate = {
    params: req.params,
  };

  const contactRules = Joi.object({
    params: {
      id: Joi.string(),
    },
  });

  const validationResult = contactRules.validate(toValidate);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
};

export const deleteContact = async function deleteContact(req, res, next) {
  try {
    const deletedContact = await ContactModel.deleteContact(req.params.id);
    if (!deletedContact) {
      throw new NotFound("Contact not found");
    }

    return res.status(200).send("Contact deleted");
  } catch (err) {
    next(err);
  }
}; 
