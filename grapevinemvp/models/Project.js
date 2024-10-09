import mongoose from 'mongoose';
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: { type: String, required: true }, // project name
  description: { type: String, required: true }, // brief description of the project
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // project owner
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // collaborator
  createdAt: { type: Date, default: Date.now }, // when the project was created (within the database)
  updatedAt: { type: Date, default: Date.now }, // when the project was updated (within the database)
  links: [{ type: String }], // links related to the project
  images: [{ type: String }], // images related to the project
  seekingCollaborators: { type: Boolean, default: false }, // whether collaborators are needed
  collaborationDetails: { type: String }, // additional collaboration details (!!!)
  tags: [{
    type: String,
    enum: ['Tech', 'Finance', 'Art', 'Music', 'Health & Wellness', 'Education', 'Environmental', 'Nonprofit', 'Entrepreneurship', 'Writing & Literature', 'Entertainment', 'Social Impact', 'Science', 'Fashion', 'Social Media', ]
  }]
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
