import AddCommentHandler from './AddCommentHandler.js';
import DeleteCommentHandler from './DeleteCommentHandler.js';
import routes from './routes.js';

export default (container) => {
  const addCommentHandler = new AddCommentHandler({
    addCommentUseCase: container.getInstance('AddCommentUseCase'),
  });

  const deleteCommentHandler = new DeleteCommentHandler({
    deleteCommentUseCase: container.getInstance('DeleteCommentUseCase'),
  });

  return routes(addCommentHandler, deleteCommentHandler);
};