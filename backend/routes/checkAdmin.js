const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ massage: "Access dinied. Admins only" });
  }
  next();
};

module.exports = checkAdmin;