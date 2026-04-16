import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ threadId, commentId, owner }) {
    await this._threadRepository.verifyThreadExists(threadId);

    await this._commentRepository.verifyCommentExists(commentId);

    const commentOwner = await this._commentRepository.getCommentOwner(commentId);

    if (commentOwner !== owner) {
      throw new AuthorizationError();
    }

    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;