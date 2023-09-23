const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

exports.signUp = async (req, res) => {
  // console.log(req.body);
  try {
    const newUser = await UserModel.create(req.body);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    await newUser.save();
    return res.status(201).json({
      message: "User Successfully Registered",
      success: true,
      data: { newUser, token },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error in creating new User" + error.message,
      success: false,
    });
  }
};

exports.signIn = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new Error("Email or Password is Empty"));
    }
    const user = await UserModel.findOne({ email }).select("+password");
    // console.log(user);

    if (!user) {
      return next(new Error("User with this email doesn't exists"));
    }

    const verifiedUser = await bcrypt.compare(password, user.password);
    if (!verifiedUser) {
      return next(new Error("Invalid Password"));
    }

    const verifiedToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      message: "User Successfully SignIn",
      success: true,
      id: user._id,
      token: verifiedToken,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, success: false });
  }
};

exports.protectedData = async (req, res, next) => {
//   console.log(req.headers.authorization);
  if (
    req.headers.authorization ||
    req.headers.authorization.startWith("Bearer ")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", status: "Access Token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid Token", status: "Failed" });
      }

      //   console.log("DecodedToken --> ", decodedToken);
      const user = await UserModel.findById(decodedToken.id);
      if (!user) {
        return res.status(401).json({
          message: "User with this id does not exist",
          status: "Failed",
        });
      }

      const passwordVerified = user.verifyPassword(decodedToken.iat);
      if (passwordVerified) {
        return res.status(200).json({
          message: "user change password please login again ",
          status: "Failed",
        });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized", status: "Failed" });
  }
  //   next();
};

exports.accessDelete = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      // return next(new Error("You don't have permission to delete this note"));
      return res.status(401).json({
        message: "You don't have permission to delete this note",
        status: "Failed",
      });
    }
    next();
  };
  // if (role === "admin") {
  //   next();
  // } else if (req.user.role === role) {
  //   next();
  // } else {
  //   return res
  //     .status(401)
  //     .json({ message: "Unauthorized", status: "Failed" });
  // }
  //   };
};

exports.forgetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    // return next(new Error("User with this email doesn't exists"));
    return res
      .status(400)
      .json({
        message: "User with this email doesn't exists",
        success: "Failed",
      });
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUri = `${req.protocol}://${req.get(
    "host"
  )}/api/resetPassword/${resetToken}`;

  const body =
    `Forget Password? Reset Password by Calling given api: ` + resetUri;
  console.log(body);

  const msg = {
    to: user.email,
    from: "muhammadmairajj@gmail.com",
    subject: "Reset Password",
    text: body,
  };

  sgMail.setApiKey(process.env.SEND_GRID_EMAIL);
  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({
        status: "Success",
        message: "Password reset link send to your email",
      });
    })
    .catch(async (error) => {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(400).json({
        status: "Failed",
        message:
          "Error in sending mail to user to reset password, please try again",
      });
    });
  //   next();
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid token or has expire", status: "Failed" });
  }

  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangeDate = Date.now();

  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  res.status(200).json({ id: "Success", result: { token } });
};

exports.changePassword = async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).select("+password");

    const verifiedUser = await bcrypt.compare(req.body.currentPassword, user.password);

    if(!user || !verifiedUser) {
        res.status(400).json({ message: "User not found or token has expire", status: "Failed" })
    }

    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn:"30d"
    });
    return res.status(200).json({ id: "Success", result: { token } })
}
