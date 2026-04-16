import AuthenticationsHandler from './handler.js';
import createAuthenticationsRouter from './routes.js';

const authentications = (container) => {
  const authenticationsHandler = new AuthenticationsHandler(container);
  return createAuthenticationsRouter(authenticationsHandler);
};

export default authentications;