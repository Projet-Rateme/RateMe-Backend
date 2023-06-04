import  mongoose  from "mongoose";
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;


const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  profilePicture: {
    type: String,
    default: 'http://localhost:8090/public/images/coollogo_com-24361680.png'
  },
  coverPicture: {
    type: String,
    default: 'http://localhost:8090/public/images/coollogo_com-24361680.png'
  },
  bio: {
    type: String,
    default: 'No bio yet'
  },
  location: {
    type: String,
    default: 'No location yet'
  },
  website: {
    type: String,
    default: 'No website yet'
  },
  birthday: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});


userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

const User = mongoose.model("User", userSchema);
export { User };