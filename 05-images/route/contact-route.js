const { Router } = require("express");
const ContactModel = require("../model/contact-model");

const contactRouter = new Router();
contactRouter.get("/", async function (req, res) {
  const list = await ContactModel.getAllContacts();
  res.status(200).json(list);
});

contactRouter.get("/:id", async function (req, res) {
  const contact = await ContactModel.getContact(req.params.id);
  res.status(200).json(contact);
});

contactRouter.put("/:id", async function (req, res) {
  const contact = await ContactModel.updateContact(req.params.id, req.body);
  res.status(200).json(contact);
});

contactRouter.post("/", async function (req, res) {
  const contact = await ContactModel.createContact(req.body);
  res.status(200).json(contact);
});

contactRouter.delete("/:id", async function (req, res) {
  const contact = await ContactModel.removeContact(req.params.id);
  res.status(200).json(contact);
});

module.exports = contactRouter;
