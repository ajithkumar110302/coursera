const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../../config");

function admin(req, res, next) {
  const token = req.headers.authorization;
  try {
    const response = jwt.verify(token, JWT_ADMIN_PASSWORD);
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

module.exports = { admin }