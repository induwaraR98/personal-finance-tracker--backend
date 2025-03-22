
const errorHandler = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
  
    // Set statusCode to 500 if it's not already set or it's undefined
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;
  
  