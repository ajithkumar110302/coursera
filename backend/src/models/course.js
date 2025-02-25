const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Course = new Schema({
  title: { type: String, unique: true },
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const CourseModel = mongoose.model("course", Course);

module.exports = {  CourseModel }