const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/mongbd");

// Import all routers
const loginRoutes = require("./routers/login");
const createRoutes = require("./routers/create");
const usersRoutes = require("./routers/users");
const adminRoutes = require("./routers/admin");

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', loginRoutes);      // GET /login, POST /login, GET /logout
app.use('/', createRoutes);     // GET /, POST /create
app.use('/', usersRoutes);      // GET /users
app.use('/', adminRoutes);      // Admin routes: /admin/*

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});