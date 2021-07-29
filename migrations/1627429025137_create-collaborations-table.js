/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // membuat table collaborations

  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    note_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /* menambahkan constraint unique, kombinasi dari kolom note_id dan user_id  guna menghindari duplikasi data antara nilai kedua kolom */

  pgm.addConstraint('collaborations', 'unique_note_id_and_user_id', 'UNIQUE(note_id, user_id)');

  // memberikan constraint foreign key pada kolom note_id dan user_id
  pgm.addConstraint('collaborations', 'fk_collaborations.note_id_notes.id', 'FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE');

  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('collaborations');
};
