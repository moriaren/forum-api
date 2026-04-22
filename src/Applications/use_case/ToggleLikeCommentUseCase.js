class ToggleLikeCommentUseCase {
  constructor({
    userCommentLikeRepository,
    commentRepository,
    threadRepository,
  }) {
    this._userCommentLikeRepository = userCommentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute({ userId, threadId, commentId }) {
    await this._threadRepository.verifyThreadExists(threadId);

    await this._commentRepository.verifyCommentExists(commentId);

    const isLiked = await this._userCommentLikeRepository.verifyLike(
      userId,
      commentId
    );

    if (isLiked) {
      await this._userCommentLikeRepository.deleteLike(
        userId,
        commentId
      );
    } else {
      await this._userCommentLikeRepository.addLike(
        userId,
        commentId
      );
    }
  }
}

export default ToggleLikeCommentUseCase;