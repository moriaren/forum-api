class AddCommentHandler {
  constructor({ addCommentUseCase }) {
    this._addCommentUseCase = addCommentUseCase;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(req, res, next) {
    try {
      const { id: owner } = req.auth?.credentials || {};
      const { threadId } = req.params;

      if (!owner) {
        return res.status(401).json({
          status: 'fail',
          message: 'Missing authentication',
        });
      }

      const payload = {
        content: req.body.content,
        threadId,
        owner,
      };

      const addedComment = await this._addCommentUseCase.execute(payload);

      return res.status(201).json({
        status: 'success',
        data: { addedComment },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AddCommentHandler;