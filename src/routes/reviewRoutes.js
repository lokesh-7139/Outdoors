const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const reviewMiddlewares = require('../middlewares/reviewMiddlewares');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authMiddlewares.protect);
router
  .route('/')
  .get(reviewMiddlewares.addReviewFilter, reviewController.getReviews)
  .post(
    authMiddlewares.restrictTo('user'),
    reviewMiddlewares.modifyBody,
    reviewMiddlewares.verifyTourBookingForReview,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewMiddlewares.addReviewFilter, reviewController.getReview)
  .patch(
    authMiddlewares.restrictTo('user'),
    reviewMiddlewares.isUserOfReview,
    reviewController.updateReview
  )
  .delete(
    authMiddlewares.restrictTo('admin', 'user'),
    reviewMiddlewares.isUserOfReview,
    reviewController.deleteReview
  );

module.exports = router;
