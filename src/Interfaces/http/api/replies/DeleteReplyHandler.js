class DeleteReplyHandler {
  constructor({ deleteReplyUseCase }) {
    this._deleteReplyUseCase = deleteReplyUseCase;

    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async deleteReplyHandler(req, res, next) {
    try {
      const { id: owner } = req.auth?.credentials || {};
      const { threadId, commentId, replyId } = req.params;

      if (!owner) {
        return res.status(401).json({
          status: 'fail',
          message: 'Missing authentication',
        });
      }

      await this._deleteReplyUseCase.execute({
        threadId,
        commentId,
        replyId,
        owner,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default DeleteReplyHandler;