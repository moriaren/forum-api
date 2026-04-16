class DetailReply {
  constructor(payload) {
    this._verify(payload);

    const { id, username, date, content, isDelete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
  }

  _verify({ id, username, date, content, isDelete }) {
    if (id === undefined || username === undefined || date === undefined || content === undefined || isDelete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' ||
        typeof username !== 'string' ||
        typeof date !== 'string' ||
        typeof content !== 'string' ||
        typeof isDelete !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailReply;
