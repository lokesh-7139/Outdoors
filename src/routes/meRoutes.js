const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const userController = require('../controllers/userController');
const meController = require('../controllers/meController');
const meMiddlewares = require('../middlewares/meMiddlewares');
const reviewRouter = require('../routes/reviewRoutes');
const bookingRouter = require('../routes/bookingRoutes');

const router = express.Router();

router.use(authMiddlewares.protect);
router.use(authMiddlewares.restrictTo('user'));

router.use('/reviews', meMiddlewares.setMeMode, reviewRouter);
router.use('/bookings', meMiddlewares.setMeMode, bookingRouter);

router
  .route('/')
  .get(meController.getMe, userController.getUser)
  .patch(meController.updateMe)
  .delete(meController.deactivateMe);

module.exports = router;
