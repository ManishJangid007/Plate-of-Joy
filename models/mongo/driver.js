const User = require('./schemas/user');

class Operations {
    async createUser(userData) {
        try {
            await User.create(userData);
            return 'User created successfully';
        } catch (e) {return e.message}
    }

    async deleteUser(userId) {
        try {
            await User.deleteOne({ _id: userId });
            return 'User deleted successfully';
        } catch (e) {return e.message}
    }

    async findById(userId) {
        try {
            const data = await User.find({ _id: userId });
            return data;
        } catch (e) {return e.message}
    }

    async findByEmail(email) {
        try {
            const data = await User.find({email: email});
            return data;
        } catch (e) {return e.message}
    }

    async findByUsername(username) {
        try {
            const data = await User.find({username: username});
            return data;
        } catch (e) {return e.message}
    }
}

const operations = new Operations();

module.exports = operations;