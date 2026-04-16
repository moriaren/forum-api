import UsersHandler from './handler.js';
import createUsersRouter from './routes.js';

const users = (container) => {
  const usersHandler = new UsersHandler(container);
  return createUsersRouter(usersHandler);
};

export default users;