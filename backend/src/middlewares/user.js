const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../../config");

function user(req, res, next) {
  const token = req.headers.authorization;
  try {
    const response = jwt.verify(token, JWT_USER_PASSWORD);
    if(response) {
      req.userId = response.id;
      next();
    } else {
      res.status(403).json({
        message: "Unauthorized user"
      })
    }
  } catch (error) {
    res.status(401).json({
      message: "invalid token"
    })
  }
}

module.exports = { user }