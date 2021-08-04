exports.up = (pgm) => {
  // membua user baru

  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')");
  // mengubah nilai owner pada note yang owner-nya bernilai null

  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner = NULL");

  // memberikan costraint foreign key pada owner terhadap kolom id dari tabel users

  pgm.addConstraint('notes', 'fk_notes.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {};
