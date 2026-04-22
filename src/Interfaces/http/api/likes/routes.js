import express from 'express';
import authMiddleware from '../../_middleware/authMiddleware.js';

const router = express.Router();

export default (handler) => {
  router.put(
    '/:threadId/comments/:commentId/likes',
    authMiddleware,
    handler.putLikeCommentHandler
  );

  return router;
};