import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  street: {
    type: String,
    default: ""
  },

  apartment: {
    type: String,
    default: ""
  },

  zip: {
    type: String,
    default: ""
  },

  city: {
    type: String,
    default: ""
  },

  country: {
    type: String,
    default: ""
  },
  cartData:{
    type: Object,
  },

  wishlist:{
    type: Object,
  },
  
  image: {
    type: String,
    required: false,
  },
  tokens: [{
    token: {
    type: String,
    required: true
      }
    }]
  }, {
  timestamps: true
  }
);



const User = mongoose.model("User", userSchema);
export default User;