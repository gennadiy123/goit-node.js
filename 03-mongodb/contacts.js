const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const express = require("express");

const server = express();

const MONGODB_URL =
  "mongodb+srv://user1:qwerty123456@cluster0-4fgw7.mongodb.net/db-contacts?retryWrites=true&w=majority";

async function main() {
  mongoose.set("useCreateIndex", true);
  await mongoose.connect(
    "MONGODB_URL",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    function (err) {
      if (err) return process.exit(1);
      server.listen(3000, function () {
        console.log("Database connection successful");
      });
    }
  );

  const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    subscription: { type: String },
    password: { type: String, required: true },
    token: {},
  });

  const ContactModel = mongoose.model("Contact", contactSchema);

  contactSchema.statics.addContact = addContact;
  contactSchema.statics.getAllContacts = getAllContacts;
  contactSchema.statics.getContactById = getContactById;
  contactSchema.statics.updateContact = updateContact;
  contactSchema.statics.removeContact = removeContact;
}

main();

// const contactsPath = path.join("db", "contacts.json");
// const state = {
//   data: [],
// };
// read((data) => (state.data = data));

async function addContact(contactParams) {
  return this.create(userParams);
}

async function getAllContacts() {
  return this.find();
}

async function getContactById(contactId) {
  return this.findById(contactId);
}

async function updateContact(contactId, contactParams) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: contactParams,
    },
    { new: true }
  );
}

async function removeContact(contactId) {
  return this.findByIdAndDelete(contactId);
}

// module.exports.listContacts = listContacts;
// function listContacts(callback) {
//   return state.data;
// }

// module.exports.getContactById = getContactById;
// function getContactById(contactId) {
//   return state.data.find((item) => {
//     return item.id.toString() === contactId;
//   });
// }

// module.exports.removeContact = function (contact) {
//   const index = state.data.indexOf(contact);
//   state.data.splice(index, 1);
//   // write(state.data);
// };

// module.exports.addContact = function ({ name, email, phone }) {
//   state.data.push({
//     id: (state.data.slice(-1)[0] || { id: 1 }).id + 1,
//     name,
//     email,
//     phone,
//   });
//   write(state.data);
//   return state.data.slice(-1);
// };

// module.exports.updateContact = function (contact, data) {
//   const contactUpdated = { ...contact, ...data };
//   state.data.splice(state.data.indexOf(contact), 1, contactUpdated);
//   write(state.data);
// };

function read(callback) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    callback(JSON.parse(data));
  });
}

function write(data) {
  fs.writeFile(contactsPath, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
  });
}
