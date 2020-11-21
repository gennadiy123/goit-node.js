import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    avatarURL: {type: String, required: false},
    subscription: {
      type: String,
      required: false,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findByEmail = findByEmail;
userSchema.statics.createUser = createUser;
userSchema.statics.updateUser = updateUser;
userSchema.statics.findByToken = findByToken;

async function findByEmail(email) {
  return this.findOne({ email });
}

async function findByToken(token) {
  return this.findOne({ token });
}

async function createUser(email, password, avatarURL) {
  return this.create({ email, password, avatarURL });
}

async function updateUser(id, setFields) {
  return this.findByIdAndUpdate(id, { $set: setFields }, { new: true });
}

export const UserModel = mongoose.model("User", userSchema);
