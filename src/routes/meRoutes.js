const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const userController = require('../controllers/userController');
const meController = require('../controllers/meController');

const router = express.Router();

router.use(authMiddlewares.protect);
router
  .route('/')
  .get(meController.getMe, userController.getUser)
  .patch(meController.updateMe)
  .delete(meController.deactivateMe);

module.exports = router;
