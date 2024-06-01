const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json('Unauthorized !');
      }
      req.decoded = decoded.id;
      next();
    });
  } else {
    res.status(401).json('Unauthorized !');
  }
};
module.exports = checkAuth;
