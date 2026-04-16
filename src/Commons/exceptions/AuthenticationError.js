import ClientError from './ClientError.js';

class AuthenticationError extends ClientError {
  constructor(message = 'unauthorized') {
    super(message, 401);
  }
}

export default AuthenticationError;