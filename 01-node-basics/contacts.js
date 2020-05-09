const fs = require("fs");
const path = require("path");

const contactsPath = path.join("db", "contacts.json");

function listContacts(callback) {
  read((data) => {
    if(typeof callback === 'function') {
      data.map(callback)
    } else {
      console.table(data)
    }
  });
}

function getContactById(contactId, callback) {
  listContacts((data) => data.id === contactId && callback(data));
}
module.exports.listContacts = listContacts;

module.exports.getContactById = getContactById;

module.exports.removeContact = function (contactId, callback) {
  read((data) => {
    const targetObj = data.find(({ id }) => id === contactId);

    if (targetObj !== undefined) {
      const index = data.indexOf(targetObj);
      data.splice(index, 1);
      write(data);
    }
  });
};

module.exports.addContact = function (name, email, phone) {
  read((data) => {
    data.push({
      id: (data.slice(-1)[0] || { id: 1 }).id + 1,
      name,
      email,
      phone,
    });
    write(data);
  });
};

// export default function getContactById(contactId) {
//   fs.readFile("contacts.json", [], (err, data) => {
//     if (err) throw err;
//     console.log(data);
//   });
// }

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
