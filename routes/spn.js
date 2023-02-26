const express = require('express');
const Recipes = require('../models/spoonacular/get_recipes');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Someone hit endpoint", req.path);
    res.send({
        test: 'spn'
    })
});

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