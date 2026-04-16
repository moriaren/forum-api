// migrations/xxxx_create_table_replies.js
export const up = (pgm) => {
  pgm.createTable('replies', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    content: { type: 'TEXT', notNull: true },
    // eslint-disable-next-line camelcase
    comment_id: { type: 'VARCHAR(50)', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    // eslint-disable-next-line camelcase
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.addConstraint('replies', 'fk_replies.comment_id', {
    foreignKeys: {
      columns: 'comment_id',
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });
};
export const down = (pgm) => {
  pgm.dropTable('replies');
};