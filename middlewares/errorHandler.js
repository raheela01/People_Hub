const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry – value already exists",
    });
  }

  if (
    err.code === "ER_ROW_IS_REFERENCED_2" ||
    err.code === "ER_NO_REFERENCED_ROW_2"
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Foreign key constraint violation" });
  }

  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
