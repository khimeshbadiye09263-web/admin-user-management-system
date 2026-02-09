const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/backend_practice");
        console.log("MongoDB connected");
    } catch (error) {
        console.log("DB error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
