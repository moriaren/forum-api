import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';

class AddThreadHandler {
  constructor({ addThreadUseCase }) {
    this._addThreadUseCase = addThreadUseCase;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(req, res, next) {
    try {
      const { id: owner } = req.auth?.credentials || {};

      if (!owner) {
        throw new AuthenticationError('Missing authentication');
      }

      const { title, body } = req.body;

      if (title === undefined || body === undefined) {
        throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      }

      const addedThread = await this._addThreadUseCase.execute({
        title,
        body,
        owner,
      });

      return res.status(201).json({
        status: 'success',
        data: { addedThread },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AddThreadHandler;