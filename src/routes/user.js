const { Router } = require("express");
const { UserModel } = require("../models/user");
const { auth } = require("../middlewares/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = Router();

userRouter.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
    try {
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    // this will do both salt and hash
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(201).json({ message: `User successfully created: ${email}` });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

userRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findOne({
      email
    })

    if(!user) {
      return res.status(404).json({ message: "User not found"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch) {
      const token = jwt.sign(user._id, process.env.USER_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(403).json({ message: "Invalid credentials"});
    }
  } catch (error) {
      console.error("Error in signin:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
})

module.exports = { userRouter }