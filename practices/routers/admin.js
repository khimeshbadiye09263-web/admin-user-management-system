const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../model/user-model");
const verifyToken = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// validation
const {
    validate,
    validateUserId,
    validateCreateAdmin,
    validateUpdateUser,
    validateUpdateUserForm
} = require("../validators/adminValidators");

// helpers
const {
    getPaginationParams,
    buildPaginationResponse,
    buildSearchQuery,
    isEmailTaken,
    findUserById,
    fetchUsersWithPagination
} = require("../utils/adminHelpers");

const router = express.Router();


// ==================== ADMIN DASHBOARD ====================

router.get(
    "/admin/dashboard",
    verifyToken,
    checkAdmin,
    async (req, res) => {
        try {

            const totalUsers = await User.countDocuments();
            const totalAdmins = await User.countDocuments({ role: "admin" });
            const regularUsers = totalUsers - totalAdmins;

            res.render("admin-dashboard", {
                admin: req.user,
                stats: {
                    totalUsers,
                    totalAdmins,
                    regularUsers
                }
            });

        } catch (error) {
            res.status(500).send("Error loading dashboard: " + error.message);
        }
    }
);


// ==================== VIEW USERS (API) ====================

router.get(
    "/admin/users",
    verifyToken,
    checkAdmin,
    async (req, res) => {
        try {

            const { page, limit, skip } = getPaginationParams(req.query);
            const search = req.query.search || "";

            const { users, total } =
                await fetchUsersWithPagination({ search, page, limit, skip });

            const pagination =
                buildPaginationResponse(page, total, limit);

            res.json({
                success: true,
                data: { users, pagination }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==================== VIEW USERS PAGE (HTML) ====================

router.get(
    "/admin/users-page",
    verifyToken,
    checkAdmin,
    async (req, res) => {
        try {

            const { page, limit, skip } = getPaginationParams(req.query, 10);
            const search = req.query.search || "";

            const searchQuery =
                buildSearchQuery(search, ["name", "email"]);

            const users = await User.find(searchQuery)
                .select("-password")
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments(searchQuery);

            const pagination =
                buildPaginationResponse(page, total, limit);

            res.render("admin-users", {
                users,
                admin: req.user,
                pagination,
                search
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }
);


// ==================== GET SINGLE USER ====================

router.get(
    "/admin/user/:id",
    verifyToken,
    checkAdmin,
    validateUserId,
    validate,
    async (req, res) => {
        try {

            const user = await findUserById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==================== EDIT USER PAGE ====================

router.get(
    "/admin/edit-user/:id",
    verifyToken,
    checkAdmin,
    validateUserId,
    validate, // ✅ fixed (you missed this before)
    async (req, res) => {
        try {

            const user = await findUserById(req.params.id);

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render("admin-edit-user", {
                user,
                admin: req.user
            });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }
);


// ==================== UPDATE USER (API) ====================

router.put(
    "/admin/user/:id",
    verifyToken,
    checkAdmin,
    validateUpdateUser,
    validate,
    async (req, res) => {
        try {

            const { name, email, role, cast, birthDate } = req.body;

            // prevent duplicate email
            if (email && await isEmailTaken(email, req.params.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use by another user"
                });
            }

            const updateData = {};

            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (role) updateData.role = role;
            if (cast) updateData.cast = cast;
            if (birthDate) updateData.birthDate = birthDate;

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                message: "User updated successfully",
                data: user
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==================== UPDATE USER (FORM) ====================

router.post(
    "/admin/update-user/:id",
    verifyToken,
    checkAdmin,
    validateUpdateUserForm,
    validate, // ✅ fixed (you missed this before)
    async (req, res) => {
        try {

            const { name, email, role, cast, birthDate } = req.body;

            if (await isEmailTaken(email, req.params.id)) {
                return res.status(400).send("Email already in use by another user");
            }

            const updateData = {
                name,
                email,
                role,
                cast,
                birthDate
            };

            const user = await User.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.redirect("/admin/users-page");

        } catch (error) {
            res.status(500).send(error.message);
        }
    }
);


// ==================== DELETE USER ====================

router.delete(
    "/admin/user/:id",
    verifyToken,
    checkAdmin,
    validateUserId,
    validate,
    async (req, res) => {
        try {

            // prevent self delete
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot delete your own account"
                });
            }

            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==================== CREATE ADMIN ====================

router.post(
    "/admin/create-admin",
    verifyToken,
    checkAdmin,
    validateCreateAdmin,
    validate,
    async (req, res) => {
        try {

            const { name, email, password, cast, birthDate } = req.body;

            if (await isEmailTaken(email)) {
                return res.status(400).json({
                    success: false,
                    message: "User with this email already exists"
                });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const newAdmin = await User.create({
                name,
                email,
                password: hashPassword,
                cast,
                birthDate,
                role: "admin"
            });

            const adminData = newAdmin.toObject();
            delete adminData.password;

            res.status(201).json({
                success: true,
                message: "Admin user created successfully",
                data: adminData
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

module.exports = router;
