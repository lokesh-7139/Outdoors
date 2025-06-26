const express = require('express');
const authMiddlewares = require('../middlewares/authMiddlewares');
const tourMiddlewares = require('../middlewares/tourMiddlewares');
const tourController = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getTours)
  .post(
    authMiddlewares.protect,
    authMiddlewares.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authMiddlewares.protect,
    authMiddlewares.restrictTo('admin', 'lead-guide'),
    tourMiddlewares.isLeadGuideOfTour,
    authMiddlewares.checkPassword,
    tourController.updateTour
  );

router
  .route('/:id/toggle-status')
  .patch(
    authMiddlewares.protect,
    authMiddlewares.restrictTo('admin', 'lead-guide'),
    tourMiddlewares.isLeadGuideOfTour,
    authMiddlewares.checkPassword,
    tourController.toggleTourStatus
  );

module.exports = router;
