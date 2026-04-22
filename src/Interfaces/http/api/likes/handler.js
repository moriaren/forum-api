class LikeCommentHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(req, res, next) {
    try {
      const userId = req.auth.credentials.id;
      const { threadId, commentId } = req.params;

      const toggleLikeCommentUseCase = this._container.getInstance(
        'ToggleLikeCommentUseCase'
      );

      await toggleLikeCommentUseCase.execute({
        userId,
        threadId,
        commentId,
      });

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LikeCommentHandler;