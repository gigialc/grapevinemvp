import User from './User.js';
import bcrypt from 'bcryptjs';

class UserModel {
    static async register(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        return user;
    }

    static async authenticate(email, password) {
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            return isMatch ? user : null;
        }
        return null;
    }
}

export default UserModel;