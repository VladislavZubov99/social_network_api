const Router = require('express');
const CommentController = require('../controller/comment.controller');
const Permissions = require('../middleware/permission');
const verifyToken = require("../middleware/auth");

const router = new Router();


router.post('/comments', verifyToken, CommentController.createComment);
router.put('/comments/:id', verifyToken, Permissions.commentPermission , CommentController.updateComment);
router.delete('/comments/:id', verifyToken, Permissions.commentPermission, CommentController.deleteComment);

module.exports = router;