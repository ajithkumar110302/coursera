const express = require("express");
const jwt = require("jsonwebtoken");
const env = require("dotenv");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");

env.config();
const app = express();
const port = process.env.PORT;

app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
})