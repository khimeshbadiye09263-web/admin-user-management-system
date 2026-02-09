const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/user-model");
const connectDB = require("../config/mongbd");

// Seed script to create default admin user
const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@example.com" });

        if (existingAdmin) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        // Hash password
        const hashPassword = await bcrypt.hash("admin123", 10);

        // Create admin user
        const admin = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: hashPassword,
            cast: "Admin",
            birthDate: new Date("1990-01-01"),
            role: "admin"
        });
        console.log("Admin user created successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error.message);
        process.exit(1);
    }
};

seedAdmin();
