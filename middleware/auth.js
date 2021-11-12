const db = require("../db");
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY || "Bearer");

    const user = await db('users').select('email', 'id').where({
      email: decoded.email,
      id: decoded.id
    }).first()
    if (user) req.user = user; else return res.status(401).send({message: "Not Authorized"});
  } catch (err) {
    return res.status(401).send({message: "Not Authorized"});
  }
  return next();
};

module.exports = verifyToken;