# 🔐 MERN Authentication App with Email Verification

This is a **secure authentication system** built with **MERN, TypeScript, and Tailwind CSS** featuring email verification, password reset, and JWT authentication.

✅ Email verification with Mailtrap 📧  
✅ Secure password validation 🔑  
✅ Zustand for state management ⚡  
✅ Smooth animations with Framer Motion 🎭  
✅ JWT cookie authentication 🍪

---

## 🚀 Features

- **User Registration with Validation:**
  - Password must have at least **6 characters**, **uppercase**, **lowercase**, **number**, and **special character**.
- **Email Verification (Mailtrap):**
  - A verification code is sent upon registration.
  - Includes an **Account Verification Email Template**.
  - ⚠️ Note: Mailtrap only works for testing purposes and emails can only be received by addresses registered in your Mailtrap account. For production, consider using **SendGrid, Mailgun, or AWS SES**.
- **Automatic Login After Verification.**
- **Dashboard with User Information:**
  - Profile details (name, email).
  - Account activity (joined date, last login).
- **Forgot Password Feature:**
  - Sends a password reset code via email.
  - Includes a **Password Reset Email Template**.
- **JWT Authentication with HTTP-only Cookies.**
- **Logout Functionality.**
- **Modern UI with Tailwind CSS and Framer Motion.**

---

## 🛠️ Tech Stack

### Frontend

- React (Vite) ⚡
- TypeScript
- Tailwind CSS 🎨
- Zustand (state management)
- Framer Motion (animations)
- React Hot Toast (notifications)
- Fetch API (for API calls)
- React Router DOM (client-side routing)

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Mailtrap (email service)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/nnerb/mern-auth.git
cd auth-app
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3️⃣ Set Up Environment Variables

Create a **.env** file in the backend folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
MAILTRAP_API_TOKEN=your_mailtrap_api_token
CLIENT_URL=your_client_url
```

### 4️⃣ Run the Application

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

## 🔥 Future Improvements

- ✅ Google & GitHub OAuth login
- ✅ Two-factor authentication (2FA)
- ✅ Dark mode toggle

---

## 📺 Inspiration

This project was inspired by [this YouTube tutorial](https://www.youtube.com/watch?v=pmvEgZC55Cg) with modifications and enhancements.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.
