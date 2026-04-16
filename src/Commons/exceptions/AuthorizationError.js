import ClientError from './ClientError.js';

class AuthorizationError extends ClientError {
  constructor(message = 'authorization error!') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export default AuthorizationError;