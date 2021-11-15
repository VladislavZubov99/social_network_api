const db = require('../db');
const {CREATED_POST} = require("../variables/returningValues");

class PostController {
  async getAllPosts(req, res) {
    try {
      const {
        limit = 100,
        offset = 0,
        comment_limit,
        comment_offset
      } = req.query;

      const posts = await db('posts as p')
        .orderBy('p.created_at', 'desc')
        .select(
          'p.id',
          'p.user_id',
          'p.title',
          'p.description',
          'p.created_at as createdAt',
          db.raw(`array_remove(
          ARRAY(
           select 
           jsonb_build_object(
            'id', c.id,
            'user_id', c.user_id,
            'post_id', c.post_id,
            'title', c.title,
            'createdAt', c.created_at
            )
            from comments c
            where c.post_id = p.id 
             order by c.created_at desc
             ${comment_limit ? 'limit ' + comment_limit : ''}
             ${comment_offset ? 'offset ' + comment_offset : ''}
             ),NULL) as comments`),
        )
        .limit(limit)
        .offset(offset)
        .groupBy('p.id');

      return res.status(200).json(posts);
    } catch (e) {
      console.error(e.message);
      return res.status(500).send('Oops :( Something went wrong...');
    }

  }

  async createPost(req, res) {
    try {
      const {
        title,
        description,
      } = req.body || {};

      if (!title) {
        return res.status(400).send('Title is required!!!');
      }

      const [newPost] = await db('posts').insert({
        title,
        description,
        user_id: req.user.id
      }).returning(CREATED_POST).catch(e => console.log(e.message));

      if (newPost) {
        return res.status(201).json(newPost);
      } else {
        return res.status(400).send({
          message: 'Bad request'
        });
      }

    } catch (e) {
      console.error(e.message);
      return res.status(500).send({message: 'Oops :( Something went wrong...'});
    }
  }

  async deletePost(req, res) {
    try {
      const {id} = req.params;

      if (!id) {
        return res.status(400).send({message: "Identificator is required"});
      }

      const postUserId = await db.select('user_id').from('posts').where({id}).first()

      if(postUserId !== req.user.id) return res.status(400).json({
        success: false,
        message: 'Permission denied'
      });

      const post = await db('posts').where({id, user_id: req.user.id}).del();

      if (post) {
        await db('comments').where({post_id: id}).del();

        return res.status(200).json({
          success: true
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Post not found'
        });
      }

    } catch (e) {
      console.error(e.message);
      return res.status(500).send('Oops :( Something went wrong...');
    }

  }


  async updatePost(req, res) {
    try {
      const {id} = req.params;

      if (!id) {
        return res.status(400).send("Identificator is required");
      }

      const {
        title,
        description
      } = req.body;

      if (title === "") return res.status(400).send("Title can not be empty");

      const [updatedPost] = await db('posts').update({
        title,
        description
      })
        .where({
          id,
          user_id: req.user.id,
        }).returning(CREATED_POST);

      return res.status(200).json(updatedPost);

    } catch (e) {
      console.error(e.message);
      return res.status(500).send({message: 'Oops :( Something went wrong...'});
    }
  }

  async getPostWithComments(req, res) {
    try {
      const {
        comments_limit,
        comments_offset
      } = req.query;

      if (comments_limit < 0 || comments_offset < 0) return res.status(400).json({
        message: 'Params must not be negative'
      });

      const posts = await db('posts as p')
        .select(
          'p.id',
          'p.user_id',
          'p.title',
          'p.description',
          'p.created_at as createdAt',
          db.raw(`array_remove(
          ARRAY(
           select 
           jsonb_build_object(
            'id', "comments"."id",
            'post_id', "comments"."post_id",
            'title', "comments"."title",
            'createdAt', "comments"."created_at"
            )
            from comments
            where "comments"."post_id" = p.id
             ${comments_limit ? 'limit ' + comments_limit : ''}
             ${comments_offset ? 'offset ' + comments_offset : ''}
             order by "comments"."created_at" desc
             ),NULL) as comments`)
        )
        .where({'p.id': req.params.id})
        .first()
        .groupBy('p.id');


      return res.status(200).json(posts);
    } catch (e) {
      console.error(e.message);
      return res.status(500).send('Oops :( Something went wrong...');
    }
  }
}

module.exports = new PostController();

