const axios = require('axios');

class Recipes {
    async getRandomRecipes(limit) {
        try {
            const res = await axios.get(`${process.env.SPN_URI}/recipes/random?number=${limit}&apiKey=${process.env.SPN_API_KEY}`)
            return res.data;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getRecipe(id) {
        try {
            const res = await axios.get(`${process.env.SPN_URI}/recipes/${id}/information?apiKey=${process.env.SPN_API_KEY}`)
            return res.data;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

const recipesObj = new Recipes();

module.exports = recipesObj;