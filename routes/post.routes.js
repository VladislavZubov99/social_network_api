const Router = require('express');
const PostController = require('../controller/post.controller');
const Permissions = require('../middleware/permission')
const verifyToken = require("../middleware/auth");
const paramsCanNotBeNegative = require("../middleware/validateQuery");

const router = new Router();

router.get('/posts', verifyToken, paramsCanNotBeNegative, PostController.getAllPosts);
router.post('/posts', verifyToken, PostController.createPost);

router.get('/posts/:id', verifyToken, paramsCanNotBeNegative, PostController.getPostWithComments);
router.put('/posts/:id', verifyToken, Permissions.postPermission, PostController.updatePost);
router.delete('/posts/:id', verifyToken, Permissions.postPermission, PostController.deletePost);

module.exports = router;