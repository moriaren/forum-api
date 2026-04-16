import NewComment from '../../Domains/comments/entities/NewComment.js';
import AddedComment from '../../Domains/comments/entities/AddedComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newComment = new NewComment(payload);

    await this._threadRepository.verifyThreadExists(newComment.threadId);

    const addedComment = await this._commentRepository.addComment(newComment);

    return new AddedComment(addedComment);
  }
}

export default AddCommentUseCase;