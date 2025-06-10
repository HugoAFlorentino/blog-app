# Blogify Press

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x%2B-blue?logo=express)](https://expressjs.com/)

A full-stack portfolio blog application featuring multi-user authentication, role-based access, posts, comments, soft delete/restore, and a comprehensive admin dashboard with activity logs.

## Table of Contents

-   [Project Description](#project-description)
-   [Features](#features)
-   [Live Demo](#live-demo)
-   [Screenshots](#screenshots)
-   [Tech Stack](#tech-stack)
-   [Setup & Installation](#setup--installation)
-   [Environment Variables](#environment-variables)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

## Project Description

Blogify Press is a robust full-stack application designed as a comprehensive blogging platform. It offers a secure and interactive environment where users can register, authenticate via JWT (JSON Web Tokens), create and manage their own blog posts, and interact with content.

A key highlight is the **Admin Dashboard**, which provides powerful administrative controls, including user management with soft delete and restore capabilities, granular post management, and detailed activity logs for auditing user and admin actions. The application prioritizes security with various middlewares and integrates external services like Google reCAPTCHA for bot protection and Brevo (Sendinblue) for email notifications (e.g., password resets).

## Features

-   **User Authentication & Authorization:**
    -   Secure user registration and authentication using JWT (Access and Refresh Tokens).
    -   Role-based authorization middleware (e.g., Admin, User).
    -   Password management: change password and forgot password flows with email reset (via Brevo).
-   **Security & Optimization:**
    -   Robust security middlewares: `helmet`, `cors`, `xss-clean`, `express-mongo-sanitize`, rate limiting.
    -   Google reCAPTCHA integration for bot protection during critical actions.
    -   Frontend optimization with React, Redux, Tailwind CSS, Framer Motion, and React Helmet Async.
-   **Content Management:**
    -   Create, read, update, and soft delete/restore functionality for blog posts.
    -   Users can manage their own content.
-   **User Management (Admin):**
    -   Admin dashboard for comprehensive user management.
    -   Soft delete and restore functionality for user accounts.
-   **Activity Logging:**
    -   Detailed activity logging of significant user and admin actions (e.g., login, post creation, deletions) for auditing.
-   **Email Notifications:**
    -   Integration with Brevo (Sendinblue) for transactional emails (e.g., password reset links).
-   **Data Validation:**
    -   Robust validation and sanitization using `express-validator` and custom middlewares.

## Live Demo

 Blogify Press live: (https://blogify-press.netlify.app/)

## Screenshots

Explore the user interface and administrative panels of Blogify Press.

### Landing Page
https://github.com/user-attachments/assets/00f1ad90-533f-43db-a492-0c279b4ba661


### User Management Dashboard
*(Admin View)*
https://github.com/user-attachments/assets/fbffc0e7-d44f-409a-88ba-6ee272c277dd


### Blog Posts Dashboard
*(Admin View)*
https://github.com/user-attachments/assets/b9dd6738-94be-4cda-b32b-da00a2026fdd



## Tech Stack

The application is built with a modern full-stack architecture.

### Backend

-   **Runtime:** `Node.js` (with `Express.js` framework)
-   **Database:** `MongoDB` with `Mongoose` ODM
-   **Authentication:** `JWT` (JSON Web Tokens), `bcrypt` for password hashing
-   **Security:** `Helmet`, `CORS`, `express-mongo-sanitize`, `xss-clean`, `express-rate-limit`
-   **Email Service:** `Nodemailer` with `Brevo API` (formerly Sendinblue)
-   **Validation:** `express-validator`
-   **Environment Management:** `dotenv`
-   **Utilities:** `cookie-parser`, `body-parser`

### Frontend

-   **Framework:** `React 18`
-   **Routing:** `React Router DOM`
-   **State Management:** `Redux Toolkit`
-   **Styling:** `Tailwind CSS`
-   **Animations:** `Framer Motion`
-   **SEO/Metadata:** `React Helmet Async`
-   **API Client:** `Axios`
-   **Bot Protection:** `Google reCAPTCHA`

## Setup & Installation

Follow these steps to get Blogify Press up and running on your local machine.

### Backend

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HugoAFlorentino/blog-app/tree/main/project-root
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    Create a `.env` file in the `backend/` directory and populate it with your environment variables (see [Environment Variables](#environment-variables) section).
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The backend server will typically run on `http://localhost:5500`.

### Frontend

1.  **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    Create a `.env` file in the `frontend/` directory and populate it with your environment variables (see [Environment Variables](#environment-variables) section).
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173` (or another port chosen by Vite).

## Environment Variables

Ensure you create `.env` files in both your `backend/` and `frontend/` directories with the following variables:

### Frontend (`frontend/.env`)

VITE_API_BASE_URL <br/>
VITE_RECAPTCHA_SITE_KEY

### Backend (`backend/.env`) 

```ini
NODE_ENV=development
PORT=5500
MONGODB_CONNECTION=your_mongodb_connection_string
ACCESS_SECRET=your_jwt_access_token_secret
REFRESH_SECRET=your_jwt_refresh_token_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_email@example.com # Use a verified sender email for Brevo
FRONTEND_URL=http://localhost:5173 # Or your deployed frontend URL
SITE_KEY=your_recaptcha_site_key # Google reCAPTCHA site key
SECRET_KEY=your_recaptcha_secret_key # Google reCAPTCHA secret key



