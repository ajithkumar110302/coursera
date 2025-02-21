{ timestamps: true }
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Purchase = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const PurchaseModel = mongoose.model("purchase", Purchase);

module.exports = {  PurchaseModel }