export const up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    // eslint-disable-next-line camelcase
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    // eslint-disable-next-line camelcase
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint(
    'user_comment_likes',
    'unique_user_comment_like',
    'UNIQUE(user_id, comment_id)'
  );
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};