import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

UserSchema.statics.authenticate = async function(email, password) {
  const user = await this.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;