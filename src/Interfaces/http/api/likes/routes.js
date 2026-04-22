import express from 'express';
import authMiddleware from '../../_middleware/authMiddleware.js';

export default (handler) => {
  const router = express.Router();

  router.put(
    '/:threadId/comments/:commentId/likes',
    authMiddleware,
    handler.putLikeCommentHandler
  );

  return router;
};