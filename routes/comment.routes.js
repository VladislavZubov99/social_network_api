const Router = require('express');
const CommentController = require('../controller/comment.controller');
const verifyToken = require("../middleware/auth");

const router = new Router();


router.post('/comments', verifyToken, CommentController.createComment);
router.put('/comments/:id', verifyToken, CommentController.updateComment);
router.delete('/comments/:id', verifyToken, CommentController.deleteComment);

module.exports = router;