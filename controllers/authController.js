const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Create New User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const findUser = await User.findOne({ $or: [{ email }, { username }] });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      username: findUser?.username,
      mobile: findUser?.mobile,
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

module.exports = { createUser, loginUser };
