# Backend Practices - User Management System

A Node.js/Express application with role-based access control (RBAC) featuring user and admin roles.

## 🚀 Features

- ✅ User registration and authentication
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Role-based access control (User/Admin)
- ✅ Admin dashboard with user management
- ✅ Search and pagination for users
- ✅ Input validation and security
- ✅ Modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd practices
```

2. Install dependencies:
```bash
npm install
```

3. Start MongoDB (if using local):
```bash
mongod
```

4. Run the application:
```bash
npm start
# or for development
npx nodemon app.js
```

5. Access the application:
```
http://localhost:3000
```

## 🔑 Creating Admin User

See [ADMIN_SETUP.md](ADMIN_SETUP.md) for instructions on creating your first admin user.

## 📚 API Endpoints

### Public Routes
- `GET /` - Registration page
- `POST /create` - Create new user
- `GET /login` - Login page
- `POST /login` - User login
- `GET /logout` - User logout

### Protected Routes (Authenticated)
- `GET /users` - Get all users (JSON)

### Admin Routes (Admin Only)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users-page` - User management page
- `GET /admin/users` - Get users with pagination (JSON)
- `GET /admin/user/:id` - Get single user
- `GET /admin/edit-user/:id` - Edit user page
- `PUT /admin/user/:id` - Update user
- `POST /admin/update-user/:id` - Update user (form)
- `DELETE /admin/user/:id` - Delete user
- `POST /admin/create-admin` - Create new admin

## 🏗️ Project Structure

```
practices/
├── config/
│   └── mongbd.js          # Database connection
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── checkAdmin.js      # Admin role verification
├── model/
│   └── user-model.js      # User schema
├── routers/
│   ├── admin.js           # Admin routes
│   ├── create.js          # User registration
│   ├── login.js           # Authentication
│   └── users.js           # User listing
├── validators/
│   └── adminValidators.js # Input validation rules
├── views/
│   ├── admin-dashboard.ejs
│   ├── admin-edit-user.ejs
│   ├── admin-users.ejs
│   ├── index.ejs
│   └── login.ejs
├── app.js                 # Express app setup
└── package.json
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens in HTTP-only cookies
- Input validation with express-validator
- Role-based access control
- MongoDB ID validation
- Duplicate email prevention

## 🛡️ User Roles

### User (Default)
- Can register and login
- Cannot access admin panel

### Admin
- Full access to admin dashboard
- Can view all users
- Can create, update, and delete users
- Can promote users to admin
- Cannot delete own account (protection)

## 📖 Usage

### Register as User
1. Go to `http://localhost:3000/`
2. Fill in registration form
3. Submit to create account

### Login
1. Go to `http://localhost:3000/login`
2. Enter email and password
3. Admins → redirected to admin dashboard
4. Users → redirected to home page

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📝 License

MIT License - feel free to use for learning and projects!

## 👨‍💻 Author

Your Name

---

**Note**: This is a practice project for learning backend development with Node.js and Express.
