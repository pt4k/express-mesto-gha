const { DEFAULT_ERROR_CODE } = require('../errors/errors');

module.exports = ((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === DEFAULT_ERROR_CODE
        ? 'Ошибка по умолчанию.'
        : message,
    });

  next();
});
