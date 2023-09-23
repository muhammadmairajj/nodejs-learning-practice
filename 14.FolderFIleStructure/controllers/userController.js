const UserModel = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
    // res.status(500).json({ status: "error", message: "This route is not yet defined." });
    const users = await UserModel.find();
    res.status(200).json({ message: "Success", results: { users } });
}

exports.createUser = (req, res) => {
    res.status(500).json({ status: "error", message: "This route is not yet defined." });
}

exports.getUser = (req, res) => {
    res.status(500).json({ status: "error", message: "This route is not yet defined." });
}

exports.updateUser = (req, res) => {
    res.status(500).json({ status: "error", message: "This route is not yet defined." });
}

exports.deleteUser = (req, res) => {
    res.status(500).json({ status: "error", message: "This route is not yet defined." });
}

exports.updateMe= async (req, res) => {
    const { name, email } = req.body;
    const newUser = { name, email };
    const updateUser = await UserModel.findByIdAndUpdate(req.user._id, newUser, {
        new: true,
        runValidators: true
    });

    if(updateUser) {
        return res.status(200).json({ message: "Success", results: { updateUser } });
    }

}