require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const { userRouter } = require("./src/routes/user");
const { courseRouter } = require("./src/routes/course");
const { adminRouter } = require("./src/routes/admin");

const app = express();

app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/course', courseRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const port = process.env.PORT || 5000;
    console.log(port); // Should log a valid port number
    app.listen(port, () => {
      console.log(`server is listening at port ${port}`);
    });
  } catch (error) {
    console.log("Error in connecting to database");
  }
}

main()