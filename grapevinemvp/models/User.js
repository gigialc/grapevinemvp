import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '/public/images/default-avatar.jpg' },
  bio: { type: String, maxlength: 500 },
  location: { type: String },
  website: { type: String },
  skills: [{ type: String }],
  education: [{ type: String }],
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String }
  },
  projects: [{
    title: { type: String },
    description: { type: String },
    link: { type: String },
    image: { type: String }
  }],
  projectInterest: { type: String },
  interests: [{ type: String }],
  events: [{ type: String }],
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Store user IDs of recommendations
}, { timestamps: true });

console.log('User model is being defined:', mongoose.models.User);

export default mongoose.models.User || mongoose.model('User', UserSchema);