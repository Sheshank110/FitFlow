const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    billingPeriod: {
      type: String,
      enum: ['month', 'year'],
      default: 'month',
    },
    description: {
      type: String,
      default: '',
    },
    features: [{ type: String }],
    isPopular: {
      type: Boolean,
      default: false,
    },
    ctaLabel: {
      type: String,
      default: 'Get Started',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pricing', pricingSchema);
