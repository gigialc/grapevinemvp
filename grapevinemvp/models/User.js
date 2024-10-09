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
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  interests: [{ type: String }],
  // events: [{ type: String }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);