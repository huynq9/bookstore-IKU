import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  shipping_address: {
    city: String,
    district: String,
    ward: String,
  },
  voucherwallet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher',
}],
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user'
  },
});

export default  mongoose.model('User', userSchema);
