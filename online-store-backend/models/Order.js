const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },

  address: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
