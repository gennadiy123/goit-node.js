const fs = require("fs");
const path = require("path");

const contactsPath = path.join("db", "contacts.json");
const state = {
  data: [],
};
read((data) => (state.data = data));

module.exports.listContacts = listContacts;
function listContacts(callback) {
  return state.data;
}

module.exports.getContactById = getContactById;
function getContactById(contactId) {
  return state.data.find((item) => {
    return item.id.toString() === contactId;
  });
}

module.exports.removeContact = function (contact) {
    const index = state.data.indexOf(contact);
    state.data.splice(index, 1);
    // write(state.data);
};

module.exports.addContact = function ({ name, email, phone }) {
  state.data.push({
    id: (state.data.slice(-1)[0] || { id: 1 }).id + 1,
    name,
    email,
    phone,
  });
  write(state.data);
  return state.data.slice(-1);
};

module.exports.updateContact = function (contact, data) {
  const contactUpdated = { ...contact, ...data };
  state.data.splice(state.data.indexOf(contact), 1, contactUpdated);
  write(state.data);
};

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
