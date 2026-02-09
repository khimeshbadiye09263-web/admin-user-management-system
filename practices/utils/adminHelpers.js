const mongoose = require("mongoose");
const User = require("../model/user-model");

/**
 * Escape regex special characters
 * (prevents regex injection and crashes)
 */

const escapeRegex = (value = "") => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Build search query for users
 * Uses safe regex + trims input
 */

const buildSearchQuery = (search, fields = ["name", "email", "cast"]) => {
    if (!search || typeof search !== "string") return {};

    const safeSearch = escapeRegex(search.trim()); 0

    if (!safeSearch) return {};

    return {
        $or: fields.map((field) => ({
            [field]: { $regex: safeSearch, $options: "i" }
        }))
    };
};

/**
 * Get pagination parameters (safe limits)
 */

const getPaginationParams = (query = {}, defaultLimit = 10) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);

    const limit = Math.min(
        Math.max(parseInt(query.limit, 10) || defaultLimit, 1),
        100 // hard cap
    );

    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Build pagination response object
 */
const buildPaginationResponse = (page, total, limit) => {
    const totalPages = Math.ceil(total / limit) || 1;

    return {
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        totalUsers: total,
        limit
    };
};

/**
 * Check if email is already taken by another user
 */
const isEmailTaken = async (email, excludeUserId = null) => {
    if (!email) return false;

    const query = { email: email.toLowerCase() };

    if (excludeUserId && mongoose.Types.ObjectId.isValid(excludeUserId)) {
        query._id = { $ne: excludeUserId };
    }

    return await User.exists(query);
};

/**
 * Find user by id
 */
const findUserById = async (userId, excludePassword = true) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }

    let query = User.findById(userId);

    if (excludePassword) {
        query = query.select("-password");
    }

    return query.lean();
};

/**
 * Fetch users with pagination and search
 */
const fetchUsersWithPagination = async ({ search, page, limit, skip }) => {
    const searchQuery = buildSearchQuery(search);

    const [users, total] = await Promise.all([
        User.find(searchQuery)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(searchQuery)
    ]);

    return { users, total };
};

module.exports = {
    buildSearchQuery,
    getPaginationParams,
    buildPaginationResponse,
    isEmailTaken,
    findUserById,
    fetchUsersWithPagination
};
