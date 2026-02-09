const express = require("express");
const User = require("../model/user-model");
const verifyToken = require("../middleware/auth");

const router = express.Router();


router.get("/users", verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
