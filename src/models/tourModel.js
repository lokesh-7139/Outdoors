const { timeStamp } = require('console');
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, meduim, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater or equal to 1.0'],
      max: [5, 'Rating must be less or equal to 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a imageCover'],
    },
    images: [String],
    startDates: {
      type: [Date],
      required: [true, 'At least one start date is required'],
      set: function (dates) {
        return dates.sort((a, b) => new Date(a) - new Date(b));
      },
      validate: [
        {
          validator: function (dates) {
            return dates.length > 0;
          },
          message: 'At least one start date is required.',
        },
        {
          validator: function (dates) {
            return dates[0] >= new Date();
          },
          message: 'The first start date must be in the future.',
        },
      ],
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function (next) {
  if (this.priceDiscount && this.priceDiscount > this.price) {
    this.invalidate(
      'priceDiscount',
      'Discount price should be less than original price'
    );
  }
});

tourSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeInactiveTours) {
    this.find({
      isActive: {
        $ne: false,
      },
    });
  }
  next();
});

tourSchema.pre(/^find/, function (next) {
  if (this.getOptions().populateGuides) {
    this.populate({
      path: 'guides',
      select: 'name email photo role',
    });
  }
  if (this.getOptions().populateReviews) {
    this.populate({
      path: 'reviews',
      select: 'review rating',
    });
  }
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
