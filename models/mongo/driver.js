const User = require('./schemas/user');

class Operations {
    async createUser(userData) {
        try {
            await User.create(userData);
            return 'User created successfully';
        } catch (e) { return e.message }
    }

    async deleteUser(userId) {
        try {
            await User.deleteOne({ _id: userId });
            return 'User deleted successfully';
        } catch (e) { return e.message }
    }

    async findById(userId) {
        try {
            const data = await User.find({ _id: userId });
            return data;
        } catch (e) { return e.message }
    }

    async findByEmail(email) {
        try {
            const data = await User.find({ email: email });
            return data;
        } catch (e) { return e.message }
    }

    async findByUsername(username) {
        try {
            const data = await User.find({ username: username });
            return data;
        } catch (e) { return e.message }
    }

    async addFavoriteRecipe(userId, recipeId) {
        try {
            await User.updateOne(
                { _id: userId },
                {
                    $push: {
                        favouriteRecipes: recipeId
                    }
                }
            );
            return 'Recipe Added Successfully';
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async removeFavoriteRecipe(userId, recipeId) {
        try {
            await User.updateOne(
                { _id: userId },
                {
                    $pull: {
                        favouriteRecipes: recipeId
                    }
                }
            );
            return 'Recipe Removed Successfully';
        } catch (e) {
            console.log(e.message);
            return false
        }
    }

    async getFavoriteRecipes(userId) {
        try {
            const data = await this.findById(userId);
            return data[0].favouriteRecipes;
        } catch (e) {
            console.log(e.message);
            return false;
        }
    }

    async findFavoriteRecipe(userId, recipeId) {
        try {
            const data = await this.getFavoriteRecipes(userId);
            if (data.includes(recipeId)) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e.message);
            return false
        }
    }
}

const operations = new Operations();

module.exports = operations;