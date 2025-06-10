# Blogify Press

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x%2B-blue?logo=express)](https://expressjs.com/)

A full-stack portfolio blog application featuring multi-user authentication, role-based access, posts, comments, soft delete/restore, and a powerful admin dashboard with activity logs.

---

## 📚 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📖 Project Description

**Blogify Press** is a portfolio-grade, full-stack blog application built for modern publishing. Users can create and manage posts, while admin users gain powerful control over platform activity through a dedicated dashboard.

Key features include user authentication with JWT, role-based access control, soft delete/restore functionality, detailed activity logging, reCAPTCHA protection, and email notifications via Brevo.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based secure login (access & refresh tokens)
  - Role-based access control (Admin, User)
  - Brevo-powered password reset via email

- **Security & Bot Protection**
  - Security middleware: `helmet`, `cors`, `xss-clean`, `mongo-sanitize`, rate limiter
  - Google reCAPTCHA integration

- **Content Management**
  - CRUD operations for blog posts with soft delete/restore
  - User-only access to their own content

- **Admin Dashboard**
  - Manage users (soft delete & restore)
  - Review and manage posts
  - Audit logs of all key actions

- **UI & UX Optimization**
  - Modern frontend with React 18, Redux Toolkit, Tailwind CSS
  - Smooth transitions via Framer Motion
  - SEO with React Helmet Async

- **Notifications & Validation**
  - Email support using Brevo API (Sendinblue)
  - Form validation via `express-validator` and custom middleware

---

## 🔗 Live Demo

👉 [**Try Blogify Press Live**](https://blogify-press.netlify.app/)

---

## 🖼️ Screenshots

### 🔹 Landing Page  
![Landing Page](https://github.com/user-attachments/assets/00f1ad90-533f-43db-a492-0c279b4ba661)

### 🔹 Admin – User Management  
![User Dashboard](https://github.com/user-attachments/assets/fbffc0e7-d44f-409a-88ba-6ee272c277dd)

### 🔹 Admin – Posts Dashboard  
![Posts Dashboard](https://github.com/user-attachments/assets/b9dd6738-94be-4cda-b32b-da00a2026fdd)

---

## 🛠️ Tech Stack

### 🔧 Backend

- **Node.js**, **Express.js**


