import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['clothing', 'grocery', 'electronics', 'furniture', 'other'], // Add more categories as needed
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSold: {
    type: Boolean,
    default: false, // Default to false indicating the item is not sold initially
  }
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
