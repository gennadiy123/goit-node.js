const argv = require("yargs").argv;
const contacts = require("./contacts");

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contacts.listContacts();
      break;

    case "get":
      contacts.getContactById(id, ({ id, name, email, phone }) => {
        console.log(`${id}\t${name}\t${phone}\t${email}`);
      });
      break;

    case "add":
      contacts.addContact({name, email, phone});
      break;

    case "remove":
      contacts.removeContact(id);
      break;

    default:
      console.warn("\x1B[38;5;202m Unknown action type!");
  }
}

invokeAction(args);
