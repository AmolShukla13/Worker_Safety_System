# 👷 Worker Safety System

A comprehensive web application designed to ensure and monitor workplace safety, streamline worker management, track attendance and wages, and handle complaints and safety alerts in real-time. The system provides separate portals for **Administrators** (management side) and **Workers** (on-site side).

---

## 📌 Features

### 🔑 Authentication & Profiles
* **Dual Roles:** Role-based access control for **Admins** and **Workers**.
* **Profile Management:** Edit personal profiles, upload profile pictures (stored via Cloudinary), update emergency contacts, and change passwords.
* **Forgot Password:** Secure reset flow using a 6-digit OTP sent to the user's email.

### 🛡️ Admin Portal
* **Dashboard Overview:** Analytical widgets displaying worker counts, active alerts, guidelines, and recent activity graphs.
* **Worker Management:** Register, update, and manage worker accounts.
* **Attendance System:** View and verify daily check-in and check-out logs of all workers.
* **Wages Management:** Log, compute, and track worker wages.
* **Complaints Desk:** Review worker grievances, toggle resolution status, and send feedback.
* **Safety Alerts:** Broadcast urgent safety notices (e.g., hazard warnings, fire drill announcements).
* **Safety Guidelines:** Publish SOPs, safety tips, and protocols.

### 👷 Worker Portal
* **Worker Dashboard:** Daily safety greetings, active alerts, and immediate navigation options.
* **Self Attendance:** Mark daily check-ins and check-outs with a single tap.
* **Wages Tracker:** Check history of wages and payments.
* **Raise Complaint:** Submit complaints directly to the admin.
* **Safety Center:** Access safety guidelines and active site alerts.
* **Emergency Helpline:** Fast access to emergency contact details of the Admin Control Room, Police, Fire, and Ambulance.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router DOM, Axios, Framer Motion (for animations), Recharts (for visualization), React Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (via Mongoose ODM).
* **Storage:** Multer + Cloudinary (for profile image uploads).
* **Security:** JSON Web Token (JWT) authorization, BcryptJS password hashing.
* **Tunnels:** LocalTunnel (for external access/demo links).

---

## 📂 Project Structure

```text
Worker-Safety-system/
├── backend/
│   ├── config/          # Database, Multer, and Cloudinary configurations
│   ├── controllers/     # Controller logic (Attendance, etc.)
│   ├── middleware/      # Auth & role verification middleware
│   ├── models/          # Mongoose Schemas (User, Alert, Complaint, etc.)
│   ├── routes/          # Express API route endpoints
│   ├── utils/           # Helper scripts (e.g., Email service)
│   ├── server.js        # Backend entry point
│   ├── start-tunnels.js # LocalTunnel startup scripts
│   └── .env             # Backend environment variables
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Global state/auth context
    │   ├── pages/       # Frontend pages (Admin & Worker portals)
    │   ├── services/    # API calls (Axios setup)
    │   ├── styles/      # CSS stylesheets
    │   ├── App.js       # App router and layout
    │   └── index.js     # React entry point
```

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

---

### 💻 Installation & Run Instructions

#### 1. Setup Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/worker-safety-system
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   # If you use nodemailer:
   # EMAIL_USER=your_email@gmail.com
   # EMAIL_PASS=your_email_password
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

> 💡 **Seed Data:** On the first database connection, the system will automatically seed a default administrator account:
> * **Email:** `shuklaamulshukla@gmail.com`
> * **Password:** `123@`
> * **Role:** `Admin`

---

#### 2. Setup Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the backend API URL. Open `frontend/src/services/api.js` and set the `baseURL`:
   ```javascript
   const API = axios.create({
     baseURL: "http://localhost:5000/api", // Point to local backend
   });
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
The app will open automatically in your browser at `http://localhost:3000`.

---

## 📡 Remote Sharing (Localtunnel)

If you want to test the app on a mobile device or share a live link with someone else, you can generate secure public URLs using localtunnel:

1. Keep your backend (`localhost:5000`) and frontend (`localhost:3000`) servers running.
2. In a new terminal window inside the `backend` directory, run:
   ```bash
   node start-tunnels.js
   ```
3. This script will:
   * Connect your backend and frontend to localtunnel.
   * Auto-update `frontend/src/services/api.js` to point to the new backend tunnel URL.
   * Output a **live demo link** that you can open on any device.
