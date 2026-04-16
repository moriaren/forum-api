import AddThreadHandler from './AddThreadHandler.js';
import GetThreadDetailHandler from './GetThreadDetailHandler.js';
import routes from './routes.js';

export default (container) => {
  const addThreadHandler = new AddThreadHandler({
    addThreadUseCase: container.getInstance('AddThreadUseCase'),
  });

  const getThreadDetailHandler = new GetThreadDetailHandler({
    getThreadDetailUseCase: container.getInstance('GetThreadDetailUseCase'),
  });

  return routes(addThreadHandler, getThreadDetailHandler);
};