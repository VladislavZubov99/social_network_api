const db = require("../db");

class Permissions {

  async commentPermission(req, res, next) {
    const {
      id
    } = req.params

    if (!id) {
      return res.status(400).send("Identificator is required");
    }

    const commentUserId = await db.select('user_id').from('comments').where({id}).first()

    if(commentUserId !== req.user.id) return res.status(400).json({
      success: false,
      message: 'Permission denied'
    });

    next()
  }

  async postPermission(req, res, next) {
    const {
      id
    } = req.params

    if (!id) {
      return res.status(400).send("Identificator is required");
    }

    const postUserId = await db.select('user_id').from('posts').where({id}).first()

    if(postUserId !== req.user.id) return res.status(400).json({
      success: false,
      message: 'Permission denied'
    });

    next()
  }
}

module.exports = new Permissions()