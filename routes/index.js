const express = require('express');
const router = express.Router();

router.get('/test', async (req, res) => {
    console.log("Someone hit the end point", req.path);
    res.json([{ test: 'test' }]);
});

router.get('/', async (req, res) => {
    console.log("Someone hit the end point", req.path);
    res.json([{ test: 'test' }]);
})

module.exports = router;