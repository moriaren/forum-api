class NewComment {
  constructor({ content, threadId, owner }) {
    this._verifyPayload({ content, threadId, owner });

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.trim() === '') {
      throw new Error('NEW_COMMENT.EMPTY_CONTENT');
    }

    if (content.length > 1000) {
      throw new Error('NEW_COMMENT.CONTENT_LIMIT_CHAR');
    }
  }
}

export default NewComment;