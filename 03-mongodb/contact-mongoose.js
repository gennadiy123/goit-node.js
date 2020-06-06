const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
});

contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.getContact = getContact;
contactSchema.statics.updateContact = updateContact;
contactSchema.statics.createContact = createContact;
contactSchema.statics.removeContact = removeContact;

const ContactModel = mongoose.model("Contact", contactSchema);

module.exports = ContactModel;

function getAllContacts() {
  return this.find();
}

function getContact(id) {
  return this.findById(id);
}

function updateContact(id, params) {
  return this.findByIdAndUpdate(id, params, { new: true });
}

function createContact(params) {
  return this.create(params);
}

function removeContact(id) {
  return this.findByIdAndDelete(id);
}
