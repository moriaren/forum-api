class AddReplyHandler {
  constructor({ addReplyUseCase }) {
    this._addReplyUseCase = addReplyUseCase;
    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(req, res, next) {
    try {
      const { id: owner } = req.auth?.credentials || {};
      const { threadId, commentId } = req.params;

      if (!owner) {
        return res.status(401).json({
          status: 'fail',
          message: 'Missing authentication',
        });
      }

      const payload = {
        content: req.body.content,
        threadId,
        commentId,
        owner,
      };

      const addedReply = await this._addReplyUseCase.execute(payload);

      return res.status(201).json({
        status: 'success',
        data: { addedReply },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AddReplyHandler;