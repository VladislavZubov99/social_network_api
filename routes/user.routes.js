const Router = require('express');
const userController = require('../controller/user.controller')
const verifyToken = require("../middleware/auth");
const paramsCanNotBeNegative = require("../middleware/validateQuery");
const validateAuth = require("../middleware/validateAuth");

const router = new Router();

router.post('/auth/sign_up', validateAuth, userController.signUp);
router.post('/auth/sign_in', validateAuth, userController.signIn);

router.get('/users/profile', verifyToken, paramsCanNotBeNegative, userController.getUserProfile);
router.put('/users/profile', verifyToken, userController.updateUser);

module.exports = router;