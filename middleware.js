const errorHandler = (err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Something Went wrong" });
};

module.exports = { errorHandler };
