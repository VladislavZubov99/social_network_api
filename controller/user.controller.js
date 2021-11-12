const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UPDATED_USER, SIGN_IN, SIGN_UP} = require("../variables/returningValues");

class UserController {
  async signUp(req, res) {
    try {
      const {
        email,
        password,
        name,
        surname
      } = req.body || {};

      if (!email || !password) {
        return res.status(400).send('Email and Password is required!!!');
      }

      const existPerson = await db.raw(`SELECT exists(SELECT email FROM users WHERE email = '${email}')`);

      if (existPerson.rows[0].exists) {
        return res.status(400).send({message: 'Email already exists'});
      }

      const encryptedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await db('users').insert({
        email,
        password: encryptedPassword,
        name,
        surname
      }).returning(SIGN_UP);

      if (newUser) {
        const token = jwt.sign(
          {id: newUser.id, email: newUser.email},
          process.env.TOKEN_KEY || 'Bearer',
          {
            expiresIn: "365d",
          }
        );

        const userWithToken = {...newUser, token};

        return res.status(200).json(userWithToken);
      } else {
        console.warn(newUser);
        return res.status(500).send({
          message: 'Oops :( Something went wrong...'
        });
      }

    } catch (e) {
      console.error(e.message);
      return res.status(500).send({
        message: 'Oops :( Something went wrong...'
      });
    }
  }

  async signIn(req, res) {
    try {
      const {email, password} = req.body;

      if (!email || !password) {
        return res.status(400).send({message: "Email and Password is required"});
      }

      const user = await db('users').select(SIGN_IN).where('email', email).first();

      if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).send("Wrong Email or Password");

      user.token = jwt.sign(
        {id: user.id, email},
        process.env.TOKEN_KEY || "Bearer",
        {
          expiresIn: "365d",
        }
      );
      delete user.password;
      return res.status(200).json(user);
    } catch (e) {
      console.error(e.message);
      return res.status(500).send({message: 'Oops :( Something went wrong...'});
    }

  }

  async getUserProfile(req, res) {
    try {
      const {
        offset,
        limit
      } = req.query;

      const user = await db('users as u')
        .select(
          'u.id',
          'email',
          'name',
          'surname',
          db.raw(`array_remove(
          ARRAY(
           select 
           jsonb_build_object(
            'id', "posts"."id",
            'user_id', "posts"."user_id",
            'title', "posts"."title",
            'createdAt', "posts"."created_at"
            )
            from posts
            where "posts"."user_id" = u.id
             ${limit ? 'limit ' + limit : ''}
             ${offset ? 'offset ' + offset : ''}
             order by "posts"."created_at" desc
             ),NULL) as posts`))
        .where({
          email: req.user.email
        })
        .groupBy('u.id')
        .first();

      return res.status(200).json(user);
    } catch (e) {
      console.error(e.message);
      return res.status(500).send({message: 'Oops :( Something went wrong...'});
    }
  }

  async updateUser(req, res) {
    try {

      const {
        name,
        surname
      } = req.body;

      if (!name && !surname) return res.status(400).send({message: 'Empty fields'});

      const [updatedPerson] = await db('users').update({
        name,
        surname
      }).where('email', req.user.email).returning(UPDATED_USER) || [];

      return res.status(200).json(updatedPerson);

    } catch (e) {
      console.error(e.message);
      return res.status(500).send({message: 'Oops :( Something went wrong...'});
    }
  }
}

module.exports = new UserController();

