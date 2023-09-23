const express = require("express");
const {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  changePassword,
  protectedData,
} = require("../controllers/authController");
const { getAllUsers, createUser, deleteUser, updateUser, getUser, updateMe } = require("../controllers/userController");

const userRouter = express.Router();

// userRouter.route("/signup").post(signUp);
// userRouter.route("/login").post(signIn);
// userRouter.route("/forgetPassword").post(forgetPassword);
// userRouter.route("/resetPassword/:token").patch(resetPassword);
// userRouter.route("/changePassword").patch(protectedData, changePassword);

userRouter.post("/signup", signUp);
userRouter.post("/login", signIn);
userRouter.post("/forgetPassword", forgetPassword)
userRouter.patch("/resetPassword/:token", resetPassword)
userRouter.patch("/changePassword", protectedData, changePassword);
userRouter.patch("/updateProfile", protectedData, updateMe);


userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).post(updateUser).delete(deleteUser);

module.exports = userRouter;
