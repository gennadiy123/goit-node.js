import Router from "express";
const contactController = require("./contact.controller");


export const contactsRouter = Router();

// C - Create
contactsRouter.post(
  "/",
  contactController.validateCreateContact,
  contactController.createContact
);

// R - Read
contactsRouter.get("/", contactController.getAllContacts);
contactsRouter.get(
  "/:id",
  contactController.validateGetContact,
  contactController.getContact
);

// U - Update
contactsRouter.put(
  "/:id",
  contactController.validateUpdateContact,
  contactController.updateContact
);

//D - Delete
contactsRouter.delete(
  "/:id",
  contactController.validateDeleteContact,
  contactController.deleteContact
);

