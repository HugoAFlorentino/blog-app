# 📓 Blogify Press

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x%2B-blue?logo=express)](https://expressjs.com/)

> A full-stack blog application with user roles, secure auth, reCAPTCHA, soft deletes, and an admin dashboard.

---

## 📖 Project Description

**Blogify Press** is a MERN-based blog app featuring:

- User and Admin roles  
- Secure JWT authentication with refresh tokens  
- Soft delete & restore for users/posts  
- reCAPTCHA v2 bot protection  
- Brevo (Sendinblue) email integration  
- Admin dashboard with activity logs  

---

## 🚀 Features

- JWT-based login system with refresh token rotation  
- Role-based access (User, Admin)  
- reCAPTCHA validation on signup & password reset  
- Email password reset via Brevo  
- Admin dashboard for managing users, posts, and logs  
- Soft delete and restore of posts and users  
- Secure backend (helmet, cors, rate-limit, mongo-sanitize, etc.)  
- Modern frontend (React 18, Tailwind CSS, Redux Toolkit)

---

## 🔗 Live Demo

👉 [**Try Blogify Press**](https://blogify-press.netlify.app/)

---

## 🖼️ Screenshots

### 🏠 Landing Page  
![Landing Page](https://github.com/user-attachments/assets/00f1ad90-533f-43db-a492-0c279b4ba661)

### 👤 Admin – User Management  
![User Dashboard](https://github.com/user-attachments/assets/fbffc0e7-d44f-409a-88ba-6ee272c277dd)

### 📝 Admin – Posts Dashboard  
![Posts Dashboard](https://github.com/user-attachments/assets/b9dd6738-94be-4cda-b32b-da00a2026fdd)

---

## 🛠️ Tech Stack

### Backend

- Node.js + Express  
- MongoDB with Mongoose  
- JSON Web Tokens (JWT), bcrypt  
- Nodemailer with Brevo API  
- Express Validator, cookie-parser  
- Security: helmet, cors, xss-clean, mongo-sanitize, express-rate-limit

### Frontend

- React 18 + Redux Toolkit  
- React Router v6  
- Tailwind CSS + Framer Motion  
- Axios, React Helmet Async  
- Google reCAPTCHA v2

---

## ⚙️ Setup & Installation

### 🔙 Backend

- git clone https://github.com/HugoAFlorentino/blog-app.git
- cd blog-app/backend
- npm install

---
🧩 Backend Environment Variables (used directly in app config):

- NODE_ENV=development
- PORT=5500
- MONGODB_CONNECTION=mongodb+srv://your_user:your_pass@cluster.mongodb.net/blogify
- ACCESS_SECRET=your_jwt_access_token_secret
- REFRESH_SECRET=your_jwt_refresh_token_secret
- BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- BREVO_SENDER_EMAIL=you@example.com
- FRONTEND_URL=http://localhost:5173
- SITE_KEY=your_recaptcha_site_key
- SECRET_KEY=your_recaptcha_secret_key

Start backend:

- npm run dev

---

💻 Frontend

- cd ../frontend
- npm install

🧩 Frontend Environment Values:

- VITE_API_BASE_URL=https://blogify-press-server.onrender.com/api/v1
- VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key

Start frontend:

- npm run dev

---

🧪 Usage

👤 Regular Users

- Register, login, update profile
- Create, edit, delete (soft), and restore blog posts
- Reset password via email with Brevo
- Protected routes using JWT
- reCAPTCHA on signup and reset

👑 Admins

- Full dashboard access
- Manage users (soft delete/restore)
- Review & manage all blog posts
- View audit logs of system actions

---

📡 API Endpoints
- Base URL: https://blogify-press-server.onrender.com/api/v1

📘 Blog Routes
- Method	Endpoint	             Description
- GET	    /blog	                 Get all blog posts
- GET	    /blog/:id	             Get a single post
- GET	    /blog/user/:userId	   Get posts by user
- POST	  /blog	                 Create new post
- PATCH	  /blog/:id	             Update a post
- PATCH	  /blog/restore/:id	     Restore a soft-deleted post

👥 User Routes
- Method	Endpoint	               Description
- POST	  /users/signup	           Register user
- POST	  /users/signin	           Login user
- POST	  /users/logout	           Logout user
- GET	    /users/refresh	         Refresh JWT token
- PATCH	  /users/profile/update	   Update profile
- PATCH	  /users/change-password	 Change password
- PATCH	  /users/delete/:id	       Soft delete user
- PATCH	  /users/restore/:id	     Restore soft-deleted user
- GET	    /users	                 Get all users (admin only)

---

📜 License

- Licensed under the MIT License

---

📬 Contact

- email: hugoflorentino86@hotmail.com
- LinkedIn: https://www.linkedin.com/in/hugo-florentino-892b61369/
- Reach me on GitHub 



