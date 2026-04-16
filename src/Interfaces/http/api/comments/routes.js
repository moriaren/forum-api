import express from 'express';

const routes = (addCommentHandler, deleteCommentHandler) => {
  const router = express.Router();

  router.post(
    '/:threadId/comments',
    addCommentHandler.postCommentHandler
  );

  router.delete(
    '/:threadId/comments/:commentId',
    deleteCommentHandler.deleteCommentHandler
  );

  return router;
};

export default routes;