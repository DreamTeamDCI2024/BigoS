import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  username: {
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
    required: true,
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
  image: String
});



const User = mongoose.model("User", userSchema);
export default User;