import LikeCommentHandler from './handler.js';
import routes from './routes.js';

export default (container) => {
  const handler = new LikeCommentHandler(container);
  return routes(handler);
};