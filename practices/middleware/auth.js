const jwt = require("jsonwebtoken");
const User = require("../model/user-model");

const verifyToken = async (req, res, next) => {
   
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
     
        const decoded = jwt.verify(token, "secreatkey");

        
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.redirect("/login");
        }

        req.user = user;

       
        next();
    } catch (err) {
        return res.redirect("/login");
    }
};

module.exports = verifyToken;
