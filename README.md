# 🏥 Hospital Management System

## 🚀 Live Demo

**Backend API:** Coming Soon  
**Frontend:** Coming Soon

---

## 📖 Overview

Hospital Management System is a full-stack healthcare management platform built to streamline communication and workflow between patients and doctors.

The platform provides secure authentication, appointment booking, medical report uploads, AI-powered report analysis, prescription management, doctor notes, health tracking, appointment history, rating system, and dedicated dashboards for patients and doctors.

It is designed to simulate a real-world hospital workflow where patients can book appointments, upload reports, track health records, and doctors can manage appointments, prescriptions, and patient records efficiently.

---

## 📸 Screenshots

### 🏠 Patient Dashboard

(Add screenshot here)

### 👨‍⚕️ Doctor Dashboard

(Add screenshot here)

### 📅 Appointments Page

(Add screenshot here)

### 📄 Medical Reports

(Add screenshot here)

### 💊 Prescriptions

(Add screenshot here)

---

## ✨ Features

### 👤 Patient Features

- Secure Authentication
- Book Appointments
- View Upcoming Appointments
- Cancel Appointments
- Appointment History
- Upload Medical Reports
- View AI Report Analysis
- Download Reports
- View Doctor Notes
- View Prescriptions
- Download Prescriptions PDF
- Rate Doctors
- Health Summary Tracking
- Profile Settings
- Appointment Rescheduling
- Online Payment (Stripe)
- Payment Invoice
- Real-time Notifications
- Google Meet Join Link for Online Consultation

---

### 👨‍⚕️ Doctor Features

- Doctor Authentication
- View Assigned Appointments
- Approve Appointments
- Reject Appointments
- Mark Appointments Completed
- Manage Prescriptions
- Edit Prescriptions
- Delete Prescriptions
- View Medical Reports
- Add Doctor Notes
- View Patient Records
- Dashboard Metrics
- Google Meet Link Creation
- Appointment Approval with Meeting Link
- Email Notifications to Patients
- Prescription Email Notifications

---

### 🤖 AI Features

- AI Medical Report Analysis
- AI Health Assistant Chat
- Smart Report Summarization

---

## 🏗️ Tech Stack

### Frontend

- React.js
- React Router DOM
- React Icons
- CSS3
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Nodemailer
- Stripe
- Tesseract.js
- pdf-parse

### AI Integration

- Groq API (Llama 3.1 8B Instant)
- OCR Support using Tesseract.js
- PDF Text Extraction
- AI Medical Report Analysis

---

## 📂 Project Structure

```bash
Hospital_Management_System/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── main.jsx
│
├── dashboard/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── main.jsx
│
├── doctor-dashboard/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── main.jsx
│
└── README.md
```

---

## 🔐 Authentication System

The project includes:

- Patient Login/Register
- Doctor Login/Register
- JWT Token Authentication
- Protected Routes
- Role-Based Access Control
- Password Reset via Email

---

## 📅 Appointment Flow

Patient:

- Books appointment
- Pays consultation fee
- Downloads invoice
- Reschedules appointment
- Joins Google Meet after approval

Doctor:

- Approves appointment
- Adds Google Meet link
- Rejects appointment
- Marks appointment completed

---

## 📄 Report Flow

Patient:

- Uploads PDF Report
- OCR automatically extracts text if needed
- AI analyzes report
- Doctor is automatically assigned
- Views doctor notes

Doctor:

- Reviews AI analysis
- Adds doctor notes
- Reviews patient history

---

## 💊 Prescription Flow

Doctor:

- Creates prescriptions
- Updates prescriptions
- Deletes prescriptions
- Sends email notification automatically

Patient:

- Receives notification
- Receives email
- Views prescriptions

---

## ❤️ Health Summary

Patients can track:

- Weight
- Hydration
- Heart Rate Stability
- Sleep Quality
- Blood Group

---

## ⭐ Review System

Patients can:

- Rate doctors after completed appointments
- Submit feedback comments

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/krishnash648/Hospital_Management_System.git
```

### Move Into Project

```bash
cd Hospital_Management_System
```

### Install Backend Dependencies

```bash
cd Backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

```bash
cd dashboard
npm install
```

```bash
cd doctor-dashboard
npm install
```

---

## ▶ Run Project

### Backend

```bash
npm run server
```

### Frontend

```bash
npm run dev
```

### Patient Dashboard

```bash
npm run dev
```

### Doctor Dashboard

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` inside Backend:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
GROQ_API_KEY=your_groq_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

---

## 📈 Future Improvements

- Admin Dashboard Frontend
- Token Expiry Handling
- Refresh Token System
- Better File Validation
- Better Mobile Responsiveness
- Multi-Hospital Support
- Advanced Analytics
- Real Google Calendar Integration
- Automatic Google Meet Creation
- WebRTC Video Calling
- Doctor Availability Calendar
- SMS Notifications
- Medical History Analytics
- Mobile Application

---

## 👨‍💻 Author

**Krishna Sharma**

**GitHub:** https://github.com/krishnash648  
**LinkedIn:** https://www.linkedin.com/in/krishna-sharma-539184215/

---

## ⭐ Final Note

This project demonstrates:

- Full Stack MERN Development
- Authentication & Authorization
- MongoDB Database Design
- REST API Development
- File Upload Management
- AI Integration
- Appointment Workflow Management
- Prescription System
- Medical Report Analysis
- Health Tracking System
- Review & Rating System
- Real-world Dashboard Architecture
- Role-Based Access System
- Healthcare Workflow Simulation

This project was built to simulate a real-world hospital ecosystem and demonstrates scalable backend architecture, structured frontend dashboards, and practical healthcare management workflows.
