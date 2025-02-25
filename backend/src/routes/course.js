const { Router } = require("express");
const { CourseModel } = require("../models/course");
const { PurchaseModel } = require("../models/purchase");
const { user } = require("../middlewares/user");

const courseRouter = Router();

courseRouter.post('/purchase', user, async (req, res) => {
  const userId = req.userId;

  const courseId = req.body.courseId;
  try {
    const course = await PurchaseModel.create({
      userId,
      courseId
    })

    res.status(201).json({ message: `Sucessfully bought the course ${courseId}`});
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error`});
  }
})

courseRouter.get('/preview', async (req, res) => {
  try {
    const courses = await CourseModel.find({});

    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Internal server error"});
  }
})

module.exports = { courseRouter }