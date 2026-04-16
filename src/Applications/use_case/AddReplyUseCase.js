import NewReply from '../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../Domains/replies/entities/AddedReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    await this._threadRepository.verifyThreadExists(payload.threadId);
    await this._commentRepository.verifyCommentExists(payload.commentId);

    const newReply = new NewReply({
      content: payload.content,
      commentId: payload.commentId,
      owner: payload.owner,
    });

    const addedReply = await this._replyRepository.addReply(newReply);

    return new AddedReply(addedReply);
  }
}

export default AddReplyUseCase;