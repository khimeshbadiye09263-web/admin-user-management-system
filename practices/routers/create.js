const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user-model");

const router = express.Router();

// GET - Show create user page (home)
router.get('/', (req, res) => {
    res.render("index");
});

// POST - Create user
router.post("/create", async (req, res) => {
    try {
        const { name, email, password, cast, birthDate } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashpassword, cast, birthDate });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
