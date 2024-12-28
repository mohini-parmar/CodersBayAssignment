const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    console.log("ajdh")
    console.log("req ",token);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); 
    console.log("decode :",decoded);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware; 
