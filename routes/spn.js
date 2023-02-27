const express = require('express');
const Recipes = require('../models/spoonacular/get_recipes');
const dataDriver = require('../models/mongo/driver');
const router = express.Router();

router.get('/', async (req, res) => {
    console.log("Someone hit endpoint", req.path);

    // await dataDriver.findFavoriteRecipe('63fc580b0ec86e3a7bc3fd3f', '656544')

    res.send({
        test: 'spn'
    })
});

router.get('/recipe_isliked/:id', async (req, res) => {
    const liked = await dataDriver.findFavoriteRecipe(req.session._id, req.params.id)
    res.send({
        liked: liked
    });
});

router.get('/like_recipe/:id', async (req, res) => {
    const success = await dataDriver.addFavoriteRecipe(req.session._id, req.params.id);
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

router.get('/dislike_recipe/:id', async (req, res) => {
    const success = await dataDriver.removeFavoriteRecipe(req.session._id, req.params.id);
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