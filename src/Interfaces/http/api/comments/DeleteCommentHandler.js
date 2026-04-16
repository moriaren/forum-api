import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class DeleteCommentHandler {
  constructor({ deleteCommentUseCase }) {
    this._deleteCommentUseCase = deleteCommentUseCase;

    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async deleteCommentHandler(req, res, next) {
    try {
      const { id: owner } = req.auth?.credentials || {};

      if (!owner) {
        throw new AuthenticationError('Missing authentication');
      }

      const { threadId, commentId } = req.params;

      await this._deleteCommentUseCase.execute({
        threadId,
        commentId,
        owner,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default DeleteCommentHandler;