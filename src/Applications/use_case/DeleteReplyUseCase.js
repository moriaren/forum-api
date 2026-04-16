import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._replyRepository.verifyReplyExists(replyId);

    const reply = await this._replyRepository.getReplyById(replyId);

    if (reply.owner !== owner) {
      throw new AuthorizationError('REPLY.NOT_OWNER');
    }

    await this._replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;