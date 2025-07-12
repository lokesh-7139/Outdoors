const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const bookingMiddlewares = require('../middlewares/bookingMiddlewares');
const bookingController = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

router.use(authMiddlewares.protect);

router
  .route('/')
  .get(
    authMiddlewares.restrictTo('user', 'lead-guide', 'admin'),
    bookingMiddlewares.checkAccess,
    bookingController.getBookings
  )
  .post(
    authMiddlewares.restrictTo('admin', 'user'),
    bookingMiddlewares.modifyBody,
    bookingController.createBooking
  );

router
  .route('/:id')
  .get(
    authMiddlewares.restrictTo('user', 'lead-guide', 'admin'),
    bookingMiddlewares.checkAccess,
    bookingController.getBooking
  );

module.exports = router;
