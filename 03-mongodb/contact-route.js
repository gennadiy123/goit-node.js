const { Router } = require("express");

module.exports = (ContactModel) => {
  const contactRouter = Router();
  contactRouter.get("/contacts", function (req, res) {
    ContactModel.find(function (err, ContactModel) {
      if (err) return console.error(err);
      res.status(200).json(ContactModel);
    });
  });

  contactRouter.get("/contacts/:id", function (req, res) {
    ContactModel.findById(req.params.id, function (err, contact) {
      if (err) return console.error(err);
      res.status(200).json(contact);
    });
  });

  contactRouter.put("/contacts/:id", function (req, res) {
    ContactModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, contact) {
        if (err) return console.error(err);
        res.status(200).json(contact);
      }
    );
  });

  contactRouter.post("/contacts", function (req, res) {
    ContactModel.create(
      req.body,
      function (err, contact) {
        if (err) return console.error(err);
        res.status(200).json(contact);
      }
    );
  });

  contactRouter.delete("/contacts/:id", function (req, res) {
    ContactModel.findByIdAndDelete(req.params.id, function (err, contact) {
      if (err) return console.error(err);
      res.status(200).json(contact);
    });
  });

  return contactRouter;
};
