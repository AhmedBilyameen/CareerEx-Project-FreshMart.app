# 🛒 CareerEx Project - FreshMart.App Backend

Welcome to the **FreshMart E-commerce App** — a robust, scalable, and production-ready REST API built using **Node.js**, **Express**, and **MongoDB**.
This backend system supports a full-fledged e-commerce application with advanced features for user management, order processing, product management, and administrative oversight.

---

## 🔧 Technologies Used

* **Node.js**
* **Express.js**
* **MongoDB & Mongoose**
* **JWT Authentication**
* **Nodemailer** (Email Notifications)
* **Express Validator** (Data Validation)
* **Multer** (File Uploads)
* **Bcrypt.js** (Password Hashing)

---

## 📁 Folder Structure

```
├── config
│   └── db.js
├── controllers
├── middlewares
├── models
├── routes
├── utils
├── app.js
├── documentation.txt
├── package.json
└── readme.md
```

---

## ✅ Features Implemented

### 🔐 Authentication & Authorization

* User Registration and Login (JWT-based)
* Role-based access control (User/Admin)
* Forgot Password and Reset Password with Expiry Token
* Email Notification on Password Change

### 👥 User Experience

* User Profile with Order History
* Update Profile Information
* Change Password from Profile with Email Notification

### 📦 Product Management

* Admin Create/Read/Update/Delete (CRUD)
* Stock Count Management
* Low Stock Alerts (e.g., <5 units)
* Image Upload Support (via Multer)

### 🛍️ Order Management

* Place Order with Validation (e.g., stock availability)
* Cancel Order & Auto-Restock
* Mark Orders as Processing, Completed
* Admin View of All Orders with Filters:

  * By Status (pending, processing, completed, cancelled)
  * By User
  * By Date

### 📊 Admin Dashboard

* View Summary:

  * Total Orders
  * Total Revenue
  * Pending vs Completed
  * Chart Data Support

### 📬 Email Notifications

* On User Registration
* On Order Placement
* On Order Cancellation
* On Password Change

### 🔍 Search & Filters

* Search Products by Keyword
* Filter Orders by User, Status, Date

### 🧪 Validations

* Register/Login/Reset Password Validation (Express Validator)
* Product & Order Data Validations
* Handles Expired Reset Tokens Gracefully

---

## 📦 API Endpoints Overview

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
PUT    /api/auth/reset-password/:token
```

### Users

```
GET    /api/users/profile
PUT    /api/users/update-profile
PUT    /api/users/change-password
```

### Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products         // Admin only
PUT    /api/products/:id     // Admin only
DELETE /api/products/:id     // Admin only
```

### Orders

```
POST   /api/orders
GET    /api/orders            // Admin view (with filters)
GET    /api/orders/my-orders  // Logged-in user
PUT    /api/orders/:id/status // Admin update order status
DELETE /api/orders/:id        // Cancel order (user)
```

### Dashboard

```
GET /api/dashboard/summary    // Admin summary dashboard
```

---

## 📧 Configuration

Create a `.env` file at the root with the following:

```env
PORT=8081
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

---

## 🚀 How to Run

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

   ```bash
   npm install
   ```
4. Run the server:

   ```bash
   npm run dev
   ```
5. Use Postman or any API testing tool to interact with the endpoints

---

## 🙌 Contributing

Feel free to open an issue or submit a pull request. All contributions are welcome!

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Future Enhancements

* Integration with a payment gateway
* Inventory reports and analytics
* Product reviews and ratings
* User Login via Google and Facebook API's

---

## 👏 Acknowledgments

This project was developed as part of a learning program to build real-world, full-featured backend systems.

---

**Backend Development Completed — Ready for Frontend Integration!**
