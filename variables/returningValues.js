const SIGN_UP = ['id', 'email', 'name', 'surname']
const SIGN_IN = [ ...SIGN_UP, 'password']

const UPDATED_USER = [...SIGN_UP]
const CREATED_POST = ['id', 'user_id', 'title', 'description', 'created_at as createdAt']

const CREATED_COMMENT = ['id', 'user_id', 'post_id', 'title', 'created_at as createdAt']

module.exports = {
  SIGN_IN,
  SIGN_UP,
  UPDATED_USER,
  CREATED_POST,
  CREATED_COMMENT
}