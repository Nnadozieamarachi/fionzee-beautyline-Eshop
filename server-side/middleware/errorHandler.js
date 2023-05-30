const { constants } = require('../constants/constants');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let title, message;
  
  switch (statusCode) {
    case constants.VALIDATION:
      res.status(400).json({
        title: 'Validation',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.status(404).json({
        title: 'Not Found',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.status(401).json({
        title: 'Unauthorized',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.status(403).json({
        title: 'Forbidden',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: 'Server Error',
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log('No Error, All Good!');
      break;
  }
  next(err)
};

module.exports = errorHandler;
