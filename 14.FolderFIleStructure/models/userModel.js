const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userModel = new mongoose.Schema({
  fullName: {
    type: String,
    require: [true, "FullName is required"],
  },
  email: {
    type: String,
    require: [true, "email must be fill"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    minLength: [8, "Password Length should have at least 8 characters"],
  },
  confirm_password: {
    type: String,
    require: [true, "User Password Confirmation is required"],
    minLength: 8,
    validate: {
      validator: function (matchPassword) {
        return matchPassword === this.password;
      },
      message: "ConfirmPassword do not match",
    },
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  photo: String,
  passwordChangeDate: Date,
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  // currentPassword: String
});

userModel.pre("save", function (next) {
  const saltRounds = 10;
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    this.confirm_password = undefined;
  }
  next();
});

userModel.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

userModel.methods.verifyPassword = function (jwtTimestamp) {
  if (this.passwordChangeDate) {
    const convertDate = parseInt(this.passwordChangeDate.getTime() / 1000);
    return convertDate > jwtTimestamp;
  }
  return false;
};

userModel.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 300000;
  return resetToken;
};

const UserModel = mongoose.model("users", userModel);

module.exports = UserModel;
