const db = require('../db');

async function migrateUsers() {
    await db.raw(`DROP TABLE IF EXISTS users CASCADE`)
    await db.schema.withSchema('public').createTable('users', (table) => {
      table.increments()
      table.string('email')
      table.string('name')
      table.string('surname')
      table.string('password')
      table.timestamps(true, true);
    })
    console.log('Created users table!')
};

async function migratePosts() {
    await db.raw(`DROP TABLE IF EXISTS posts CASCADE`)
    await db.schema.withSchema('public').createTable('posts', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.string('title')
      table.string('description')
      table.timestamps(true, true);
    })
    console.log('Created posts table!')
};

async function migrateComments() {
    await db.raw(`DROP TABLE IF EXISTS comments CASCADE`)
    await db.schema.dropTableIfExists('comments')
    await db.schema.withSchema('public').createTable('comments', (table) => {
      table.increments()

      table.integer('user_id').unsigned()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.integer('post_id').unsigned()
        .references('posts.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.string('title')
      table.timestamps(true, true);
    })
    console.log('Created comments table!')
}

migrateUsers()
  .then(migratePosts)
  .then(migrateComments)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)

    process.exit(1)
  })