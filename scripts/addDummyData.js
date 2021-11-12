const bcrypt = require('bcryptjs')
const db = require('../db');

const createEmail = () => Math.random().toString(36).substr(2, 9) + '@mail.ru';

async function addDummyUser() {
  const email = createEmail()
  const password = await bcrypt.hash(email, 10);
  const [id] = await db('users').insert({name: 'John', surname: 'Snow', password, email: email}).returning('id')

  console.log('Added dummy user: \nemail: ', email, '\npassword: ', email,'\n')
  return id
}

async function addDummyPosts(userId) {
  const [firstPost] = await db('posts').insert({
    title: 'First Dummy Post',
    description: 'Dummy Description',
    user_id: userId
  }).returning('id')
  const [secondPost] = await db('posts').insert({
    title: 'Second Dummy Post',
    description: 'Dummy Description',
    user_id: userId
  }).returning('id')
  const [thirdPost] = await db('posts').insert({
    title: 'Third Dummy Post',
    description: 'Dummy Description',
    user_id: userId
  }).returning('id')

  console.log('Added dummy posts!')
  return {
    userId: userId,
    postsIds: [firstPost, secondPost, thirdPost]
  }
}


async function addDummyComments({userId, postsIds}) {
  const [firstPost, secondPost] = postsIds
  await db('comments').insert({title: 'First Dummy Comment For First Post', user_id: userId, post_id: firstPost})
  await db('comments').insert({title: 'Second Dummy Comment For First Post', user_id: userId, post_id: firstPost})
  await db('comments').insert({title: 'First Dummy Comment For Second Post', user_id: userId, post_id: secondPost})

  console.log('Added dummy comments!')
}


addDummyUser()
  .then((userId) => addDummyPosts(userId))
  .then((val) => addDummyComments(val))
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })