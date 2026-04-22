import DetailThread from '../../Domains/threads/entities/DetailThread.js';
import DetailComment from '../../Domains/comments/entities/DetailComment.js';
import DetailReply from '../../Domains/replies/entities/DetailReply.js';

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  _normalizeDate(date) {
    return typeof date === 'string' ? date : date.toISOString();
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = thread.comments || [];

    const commentIds = comments.map((c) => c.id);

    const replies =
      commentIds.length > 0
        ? await this._replyRepository.getRepliesByCommentIds(commentIds)
        : [];

    const repliesMap = replies.reduce((acc, reply) => {
      const key = reply.comment_id ?? reply.commentId;

      if (!acc[key]) acc[key] = [];
      acc[key].push(reply);

      return acc;
    }, {});

    const commentsWithReplies = comments.map((comment) => {
      const mappedReplies = (repliesMap[comment.id] || []).map(
        (reply) =>
          new DetailReply({
            id: reply.id,
            username: reply.username,
            date: this._normalizeDate(reply.date),
            content: reply.content,
            isDelete: reply.is_delete,
          })
      );

      return new DetailComment({
        id: comment.id,
        username: comment.username,
        date: this._normalizeDate(comment.date),
        content: comment.content,
        isDelete: comment.is_delete,
        likeCount: comment.likeCount,
        replies: mappedReplies,
      });
    });

    return new DetailThread({
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: this._normalizeDate(thread.date),
      username: thread.username,
      comments: commentsWithReplies,
    });
  }
}

export default GetThreadDetailUseCase;