const express = require('express');
const Recipes = require('../models/spoonacular/get_recipes');
const dataDriver = require('../models/mongo/driver');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("Someone hit endpoint", req.path);
    res.send({
        test: "test"
    });
});

router.get('/search_recipe', async (req, res) => {
    const query = req.query.query;
    let data = [];

    if (query) {
        data = await Recipes.searchRecipe(query, 20)
    }
    else data = false;

    if (data) {
        res.send({
            success: true,
            recipes: data.results
        })
    } else {
        res.send({
            success: false,
            recipes: []
        });
    }
});

router.get('/favourite_recipes', async (req, res) => {
    const data = await dataDriver.getFavoriteRecipes(req.session._id);
    if (data) {
        res.send({
            success: true,
            recipes: data
        });
    } else {
        res.send({
            success: false,
            recipes: []
        });
    }
});

router.get('/recipe_isliked/:id', async (req, res) => {
    const liked = await dataDriver.findFavoriteRecipe(req.session._id, req.params.id)
    res.send({
        liked: liked
    });
});

router.post('/like_recipe', async (req, res) => {
    const success = await dataDriver.addFavoriteRecipe(req.session._id, req.body);
    if (success) {
        res.send({
            success: true
        });
    } else {
        res.send({
            success: false
        })
    }
})

router.post('/dislike_recipe', async (req, res) => {
    const success = await dataDriver.removeFavoriteRecipe(req.session._id, req.body.recipeId);
    if (success) {
        res.send({
            success: true
        });
    } else {
        res.send({
            success: false
        })
    }
})

router.get('/recipe/:id', async (req, res) => {
    const recipe = await Recipes.getRecipe(req.params.id);
    if (recipe) {
        res.send({
            success: true,
            recipe: recipe
        })
    } else {
        res.send({
            success: false
        });
    }
});

router.get('/similar_recipes', async (req, res) => {
    const recipes = await Recipes.getRandomRecipes(5);

    if (recipes) {
        res.send({
            success: true,
            recipes: [...recipes.recipes]
        })
    } else {
        res.send({
            success: false
        });
    }
});

router.get('/random_recipes', async (req, res) => {
    const random_recipes = await Recipes.getRandomRecipes(20);

    if (random_recipes) {
        res.send({
            success: true,
            recipes: [...random_recipes.recipes]
        })
    } else {
        res.send({
            success: false,
        });
    }
});

module.exports = router;