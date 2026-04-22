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
    },
    // eslint-disable-next-line camelcase
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'user_comment_likes',
    'fk_user_comment_likes.user_id_users.id',
    {
      foreignKeys: {
        columns: 'user_id',
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
    }
  );

  pgm.addConstraint(
    'user_comment_likes',
    'fk_user_comment_likes.comment_id_comments.id',
    {
      foreignKeys: {
        columns: 'comment_id',
        references: 'comments(id)',
        onDelete: 'CASCADE',
      },
    }
  );

  pgm.addConstraint(
    'user_comment_likes',
    'unique_user_comment_like',
    {
      unique: ['user_id', 'comment_id'],
    }
  );
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};