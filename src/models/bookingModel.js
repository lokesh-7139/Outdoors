const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfPeople: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    tourStatus: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'completed'],
      default: 'Upcoming',
    },
    BookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'failed'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'cash'],
      default: 'razorpay',
    },
    transactionId: {
      type: String,
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userNotes: {
      type: String,
      maxlength: 500,
    },
    adminNotes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre(/^find/, function () {
  if (this.getOptions().populateTour) {
    this.populate({
      path: 'tour',
      select: 'name',
    });
  }
  if (this.getOptions().populateUser)
    this.populate({
      path: 'user',
      select: 'name photo email',
    });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
