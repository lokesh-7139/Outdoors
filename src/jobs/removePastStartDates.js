const cron = require('node-cron');
const Tour = require('../models/tourModel');

cron.schedule('0 0 * * *', async () => {
  try {
    const tours = await Tour.find();

    for (let tour of tours) {
      const originalLength = tour.startDates.length;
      while (tour.startDates.length && tour.startDates[0] < new Date()) {
        tour.startDates.shift();
      }

      if (tour.startDates.length === 0) {
        tour.isActive = false;
      }
      if (tour.startDates.length !== originalLength || !tour.isActive) {
        await tour.save();
      }
    }
  } catch (err) {
    console.log('Error in updating start dates', err);
  }
});
