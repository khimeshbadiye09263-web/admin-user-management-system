
const checkAdmin = (req, res, next) => {
   
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user found. Please login first."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Admin access required. You do not have permission to access this resource."
        });
    }

    next();
};

module.exports = checkAdmin;
