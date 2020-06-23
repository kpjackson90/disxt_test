const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

mongoose.model('Product', ProductSchema);
