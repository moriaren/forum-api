import express from 'express';
import LikeCommentHandler from './handler.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const routes = (container) => {
  const router = express.Router();
  const handler = new LikeCommentHandler(container);

  router.put(
    '/threads/:threadId/comments/:commentId/likes',
    authMiddleware,
    handler.putLikeCommentHandler
  );

  return router;
};

export default routes;