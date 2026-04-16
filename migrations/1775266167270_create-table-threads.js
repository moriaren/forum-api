// migrations/20260404_create_table_threads.js
export const up = (pgm) => {
  pgm.createTable('threads', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'TEXT', notNull: true },
    body: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    date: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('CURRENT_TIMESTAMP') },
  });
};

export const down = (pgm) => {
  pgm.dropTable('threads');
};