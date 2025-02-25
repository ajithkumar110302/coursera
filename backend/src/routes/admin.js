const { Router } = require("express");

const adminRouter = Router();
const { AdminModel } = require("../models/admin");
const { CourseModel } = require("../models/course");
const { admin } = require("../middlewares/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../../config");

adminRouter.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
    try {
    const user = await AdminModel.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }
    // this will do both salt and hash
    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminModel.create({
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

adminRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminModel.findOne({
      email
    })

    if(!user) {
      return res.status(404).json({ message: "User not found"});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(JWT_ADMIN_PASSWORD);
    if(passwordMatch) {
      const token = jwt.sign({
        id: user._id
      }, JWT_ADMIN_PASSWORD);
      res.status(200).json({ token });
    } else {
      res.status(403).json({ message: "Invalid credentials"});
    }
  } catch (error) {
      console.error("Error in signin:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
})

// auth admin middleware
adminRouter.use(admin);

adminRouter.post('/course', async (req, res) => {
  const adminId = req.userId;

  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await CourseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId
    })

    res.status(201).json({
      message: "Course successfully created",
      courseId: course._id,
    });
  } catch (error) {
    console.log(`Error while creating course ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
})

adminRouter.put('/course', async (req, res) => {
  const adminId = req.userId;

  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await CourseModel.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        title,
        description,
        imageUrl,
        price,
      })

    res.status(201).json({
      message: "Course successfully updated",
      courseId: course._id,
    });
  } catch (error) {
    console.log(`Error while creating course ${error}`);
    res.status(500).json({ message: "Internal server error"});
  }
});

adminRouter.get('/courses', async (req, res) => {
  const adminId = req.userId;

  try {
    const courses = await CourseModel.find({
      creatorId: adminId
    })

    res.status(200).json({ courses });
  } catch (error) {
    res.status(401).json({ message: "Creator not found"})
  }
})

adminRouter.delete("/course/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully", deletedCourse });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
});


module.exports = { adminRouter }