const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    name: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    college: { type: String },
    city: { type: String },
    skills: [{ type: String }],
    handles: [
      {
        platform: String,
        handle: String,
        url: String,
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = function (password) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
