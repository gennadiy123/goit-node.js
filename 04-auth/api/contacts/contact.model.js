import mongoose from "mongoose";

const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
});

contactSchema.statics.createContact = createContact;
contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.getContact = getContact;
contactSchema.statics.updateContact = updateContact;
contactSchema.statics.deleteContact = deleteContact;

export const ContactModel = mongoose.model("Contact", contactSchema);

async function createContact(contactParams) {
  return this.create(contactParams);
}

async function getAllContacts() {
  return this.find();
}

async function getContact(id) {
  return this.findById(id);
}

async function updateContact(contactId, contactParams) {
  return this.findByIdAndUpdate(
    contactId,
    { $set: contactParams },
    { new: true }
  );
}

async function deleteContact(contactId) {
  return this.findByIdAndDelete(contactId);
}
