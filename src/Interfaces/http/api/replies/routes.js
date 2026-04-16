import express from 'express';

const routes = (addReplyHandler, deleteReplyHandler) => {
  const router = express.Router();

  router.post(
    '/:threadId/comments/:commentId/replies',
    addReplyHandler.postReplyHandler
  );

  router.delete(
    '/:threadId/comments/:commentId/replies/:replyId',
    deleteReplyHandler.deleteReplyHandler
  );

  return router;
};

export default routes;