const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user-model");

const router = express.Router();


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials");
        }

        // Create token with secret key
        const token = jwt.sign({ userId: user._id }, "secreatkey", { expiresIn: "1h" });

        // Store token in cookie
        res.cookie("token", token, { httpOnly: true });


        if (user.role === 'admin') {

            res.redirect('/admin/dashboard');
        } else {

            res.redirect('https://github.com/khimeshbadiye09263-web/ecommerce-web-app');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


router.get('/logout', (req, res) => {

    res.clearCookie('token');

    res.redirect('/login');
});

module.exports = router;
