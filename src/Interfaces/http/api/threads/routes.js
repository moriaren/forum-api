import express from 'express';

const routes = (addThreadHandler, getThreadDetailHandler) => {
  const router = express.Router();

  router.post('/', addThreadHandler.postThreadHandler);
  router.get('/:threadId', getThreadDetailHandler.getThreadDetailHandler);

  return router;
};

export default routes;