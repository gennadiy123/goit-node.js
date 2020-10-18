const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
});

userSchema.statics.getUser = getUser;
userSchema.statics.existUser = existUser;
userSchema.statics.createUser = createUser;
userSchema.statics.getUserByEmailAndPassword = getUserByEmailAndPassword;
userSchema.statics.updateUser = updateUser;
userSchema.statics.findByToken = findByToken;


module.exports = mongoose.model("User", userSchema);

async function getUser(email) {
  return this.findOne({ email });
}

async function getUserByEmailAndPassword(email, password) {
  return this.findOne({ email, password });
}

async function existUser(email) {
  return (await this.getUser(email)) ? true : false;
}

async function createUser(email) {
  return this.create(email);
}

async function updateUser(id, setFields) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: setFields,
    },
    { new: true }
  );
}

async function findByToken(token) {
  return this.findOne({ token });
}