const db = require('../db')
const {CREATED_COMMENT} = require("../variables/returningValues");

class CommentController {
  async createComment(req, res) {
    try {
      const {
        title,
        post_id
      } = req.body || {};

      if (!post_id) {
        return res.status(400).send({message: 'post_id is required!!!'});
      }

      if (!title) {
        return res.status(400).send({message: 'title is required!!!'});
      }

      const [newComment] = await db('comments').insert({
        title,
        post_id: post_id,
        user_id: req.user.id
      }).returning(CREATED_COMMENT).catch(e => console.log(e.message))

      if (newComment) {
        return res.status(200).json(newComment);
      } else {
        return res.status(400).send({
          message: 'Bad request'
        });
      }

    } catch (e) {
      console.error(e.message)
      return res.status(500).send('Oops :( Something went wrong...')
    }
  }

  async updateComment(req, res) {
    try {
      const {id} = req.params;

      const {
        title,
      } = req.body

      const [updatedComment] = await db('comments').update({
        title,
      })
        .where({
          id,
          user_id: req.user.id,
        }).returning(CREATED_COMMENT).catch(e => console.log(e.message))

      if (updatedComment) {
        return res.status(200).json(updatedComment);
      } else {
        return res.status(400).send({
          message: 'Bad request'
        });
      }
    } catch (e) {
      console.error(e.message)
      return res.status(500).send({message: 'Oops :( Something went wrong...'})
    }
  }

  async deleteComment(req, res) {
    try {
      const {id} = req.params;

      const isDeleted = await db('comments')
        .where({
          id,
          user_id: req.user.id,
        }).del().catch(e => console.log(e.message))

      if (isDeleted) {
        return res.status(200).json({success: true});
      } else {
        return res.status(400).send({
          message: 'Bad request'
        });
      }
    } catch (e) {
      console.error(e.message)
      return res.status(500).send({message: 'Oops :( Something went wrong...'})
    }
  }
}

module.exports = new CommentController()