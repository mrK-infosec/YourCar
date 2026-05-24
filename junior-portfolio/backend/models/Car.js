const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  mileage: {
    type: Number,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  condition: {
    type: String,
    enum: ['new', 'used'],
    default: 'used'
  },
  images: [{
    type: String
  }],
}, { timestamps: true });

// Add basic indexes for search and filtering
carSchema.index({ brand: 1 });
carSchema.index({ price: 1 });

module.exports = mongoose.model('Car', carSchema);
