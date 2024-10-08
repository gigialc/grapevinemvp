import mongoose from 'mongoose';
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  link: { type: String },
  images: [{ type: String }]
});

const Project = mongoose.model('Project', projectSchema);
export default Project;