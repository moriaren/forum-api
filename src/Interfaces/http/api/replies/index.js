import AddReplyHandler from './AddReplyHandler.js';
import DeleteReplyHandler from './DeleteReplyHandler.js';
import routes from './routes.js';

export default (container) => {
  const addReplyHandler = new AddReplyHandler({
    addReplyUseCase: container.getInstance('AddReplyUseCase'),
  });

  const deleteReplyHandler = new DeleteReplyHandler({
    deleteReplyUseCase: container.getInstance('DeleteReplyUseCase'),
  });

  return routes(addReplyHandler, deleteReplyHandler);
};