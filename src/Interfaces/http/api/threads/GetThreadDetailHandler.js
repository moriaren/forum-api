class GetThreadDetailHandler {
  constructor({ getThreadDetailUseCase }) {
    this._getThreadDetailUseCase = getThreadDetailUseCase;
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async getThreadDetailHandler(req, res, next) {
    try {
      const { threadId } = req.params;
      const thread = await this._getThreadDetailUseCase.execute(threadId);

      return res.status(200).json({
        status: 'success',
        data: { thread },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default GetThreadDetailHandler;
