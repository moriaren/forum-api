import ClientError from '../../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../../Commons/exceptions/DomainErrorTranslator.js';

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const translatedError = DomainErrorTranslator.translate(err);

  if (translatedError instanceof ClientError) {
    return res.status(translatedError.statusCode).json({
      status: 'fail',
      message: translatedError.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'terjadi kegagalan pada server kami',
  });
};