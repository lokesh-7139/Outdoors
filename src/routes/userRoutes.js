const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const userMiddlewares = require('../middlewares/userMiddlewares');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authMiddlewares.protect, authMiddlewares.restrictTo('admin'));
router.route('/').get(userMiddlewares.limitUserFields, userController.getUsers);
router
  .route('/:id')
  .get(userMiddlewares.limitUserFields, userController.getUser)
  .patch(authMiddlewares.checkPassword, userController.promoteUser)
  .delete(authMiddlewares.checkPassword, userController.deleteUser);

module.exports = router;
