# AgroVista 
# 🌿 AgroVista — India's AI-Powered Agrotourism Platform

> TYBSCIT Final Year Project | Department of Information Technology | Academic Year 2025–26

AgroVista is a full-stack agrotourism platform that connects urban travellers with authentic farm experiences across rural India. It features AI-powered trip planning, plant disease detection, a smart chatbot, online booking with payments, and a complete admin dashboard.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [AI Services](#ai-services)
- [Pages & Routes](#pages--routes)
- [Future Scope](#future-scope)
- [Team](#team)

---

## Overview

AgroVista solves the problem of India's fragmented agrotourism sector by providing:

- A unified discovery platform for 60+ verified farm destinations across all 28 states
- AI-powered tools built on Google Gemini 2.5 Flash
- Secure booking system with Razorpay payment integration
- Role-based access for users and admins
- Real-time news from Indian agriculture via GNews API

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework and build tool |
| TailwindCSS | Utility-first styling |
| Framer Motion | Animations and transitions |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| Chart.js + react-chartjs-2 | Admin analytics charts |
| Leaflet + react-leaflet | Interactive maps |
| jsPDF | PDF invoice generation |
| Razorpay SDK | Payment gateway integration |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL (pg) | Primary database |
| JWT (jsonwebtoken) | Authentication tokens |
| Bcrypt | Password hashing |
| Nodemailer | OTP email delivery |
| Passport.js | Google OAuth 2.0 |
| Express Session | Session management |

### AI Service
| Technology | Purpose |
|------------|---------|
| FastAPI (Python) | AI microservice framework |
| Google Gemini 2.5 Flash | LLM for chatbot and recommendations |
| Gemini Vision API | Plant disease detection from images |
| python-dotenv | Environment variable management |

### Infrastructure
| Service | Port |
|---------|------|
| React Frontend | :5173 |
| Node.js Backend | :5000 |
| FastAPI AI Service | :8001 |
| PostgreSQL Database | :5432 |

---

## Project Structure

```
AGROVISTA/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── OtpVerify.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── VerifyResetOtp.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── GoogleCallback.jsx
│   │   │   ├── Places.jsx
│   │   │   ├── PlaceDetails.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── ActivityDetails.jsx
│   │   │   ├── Culture.jsx
│   │   │   ├── CultureDetail.jsx
│   │   │   ├── Birds.jsx
│   │   │   ├── Blogs.jsx
│   │   │   ├── BookNow.jsx
│   │   │   ├── AIChatbot.jsx
│   │   │   ├── DiseaseDetector.jsx
│   │   │   ├── Recommendation.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EditProfile.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── places.routes.js
│   │   │   ├── bookings.routes.js
│   │   │   ├── activities.routes.js
│   │   │   ├── culture.routes.js
│   │   │   ├── birds.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── payment.routes.js
│   │   │   └── users.routes.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── razorpay.js
│   │   ├── utils/
│   │   │   └── sendOtp.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── ai-service/
│   ├── main.py
│   ├── model/
│   │   └── plant.py
│   ├── services/
│   │   ├── chatbot.py
│   │   └── recommendation.py
│   ├── .env
│   └── requirements.txt
│
└── README.md
```

---

## Features

### 🗺️ Destinations
- 60+ verified agrotourism destinations across all 28 Indian states
- Gallery images, highlights, best time to visit, price range
- Interactive map with GPS coordinates
- State and district filtering, search and sort

### 🎯 Activities
- 24 curated farm activities in 3 categories: Outdoor, Workshop, Cultural
- Organic Farm Walk, Bullock Cart Safari, Beekeeping, Clay Pottery, Cooking Masterclass and more
- Activity ratings and reviews with admin approval system

### 🎉 Culture & Festivals
- 35+ harvest festivals across all Indian states
- Complete history, significance, rituals and agricultural importance
- Gallery images and crop information

### 🦅 Birds
- 50 bird species found in Indian farm ecosystems
- Scientific name, rarity, habitat, diet, season information
- Wikipedia-sourced bird images

### 📰 Blogs
- Live agriculture news from GNews API
- Real-time India agriculture articles
- Category filtering and search

### 🤖 AI Chatbot
- Google Gemini 2.5 Flash powered chatbot
- Agrotourism, farming, plant disease and culture expertise
- Conversation history support
- 20+ keyword fallback responses for quota handling

### 🌿 Plant Disease Detector
- Upload any leaf photo for instant AI diagnosis
- Returns: plant name, disease, confidence %, severity, treatment
- Powered by Gemini Vision API

### 🧠 AI Trip Recommender
- 6-question preference quiz (group type, budget, duration, interest, season, state)
- AI generates personalized destinations, activities, best time and packages
- Fallback recommendations by interest keyword

### 💳 Booking System
- Complete booking flow with activity selection
- Razorpay payment gateway integration
- Booking status management (pending / confirmed / cancelled)
- PDF invoice download via jsPDF

### 🔒 Authentication
- Email + Password login with 6-digit OTP verification
- Google OAuth 2.0 via Passport.js
- JWT-based session management
- Role-based access control (user / admin)
- Forgot password with OTP reset flow

### ⚙️ Admin Dashboard
- Platform statistics (users, bookings, revenue, destinations)
- Booking management with confirm/cancel controls
- Monthly revenue and bookings charts (Line + Bar)
- Activity popularity analytics
- Pending review approval system

---

## Database Schema

### Tables

```sql
users                 -- id, name, email, password, role
agrotourism_places    -- id, name, state, district, description, rating, 
                      -- image_url, gallery_images[], highlights[], 
                      -- best_time, price_range, latitude, longitude
activities            -- id, title, category, difficulty, duration, price,
                      -- benefits[], what_to_bring[], suitable_for[],
                      -- gallery_images[], included[], season
bookings              -- id, user_id, place_id, guests, booking_date,
                      -- total_price, status, order_id, payment_id, payment_status
booking_activities    -- id, booking_id, activity_id
activity_ratings      -- id, activity_id, user_id, rating, review, is_approved
state_culture         -- id, state_name, festival_name, description, history,
                      -- significance, rituals, crops_celebrated[], gallery_images[]
birds                 -- id, name, scientific_name, habitat, region, season,
                      -- rarity, description, diet, size, fun_fact, image_url
packages              -- id, place_id, title, duration, price, includes
otp_verifications     -- id, user_id, otp_code, expires_at, created_at
```

### Data Counts
| Table | Records |
|-------|---------|
| agrotourism_places | 62 destinations |
| activities | 24 activities |
| state_culture | 35 festivals |
| birds | 50 species |

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.10+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/agrovista.git
cd agrovista
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Install AI Service Dependencies
```bash
cd ai-service
pip install -r requirements.txt
```

### 5. Create the PostgreSQL Database
```sql
CREATE DATABASE agrovista;
```

---

## Environment Variables

### Backend `.env`
```env
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=agrovista
DB_PORT=5432

# Auth
JWT_SECRET=agrovista_jwt_secret_key_2026_super_secure_xyz789
SESSION_SECRET=agrovista_session_secret_2026_abc123

# Email (Gmail App Password)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### AI Service `.env`
```env
# Separate key per service to maximize free-tier quota
GEMINI_KEY_CHAT=AIza_your_key_for_chatbot
GEMINI_KEY_DISEASE=AIza_your_key_for_disease_detector
GEMINI_KEY_RECOMMEND=AIza_your_key_for_recommender
```

---

## Running the Project

Open **3 separate terminal windows**:

### Terminal 1 — Frontend
```bash
cd frontend
npm run dev
# Runs at http://localhost:5173
```

### Terminal 2 — Backend
```bash
cd backend
node src/server.js
# Runs at http://localhost:5000
```

### Terminal 3 — AI Service
```bash
cd ai-service
# Activate virtual environment first
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

uvicorn main:app --reload --port 8001
# Runs at http://localhost:8001
```

---

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Login — returns userId, sends OTP |
| POST | `/verify-otp` | Verify OTP — returns JWT token |
| POST | `/signup` | Register new user |
| POST | `/forgot-password` | Send password reset OTP |
| POST | `/verify-reset-otp` | Verify reset OTP |
| POST | `/reset-password` | Set new password |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |

### Places Routes (`/api/places`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all destinations |
| GET | `/:id` | Get single destination |

### Bookings Routes (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new booking |
| GET | `/user/:userId` | Get user's bookings |
| GET | `/` | Get all bookings (admin) |
| PUT | `/:id` | Update booking status |

### Activities Routes (`/api/activities`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all activities |
| GET | `/:id` | Get single activity |
| POST | `/:id/ratings` | Submit activity rating |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Platform statistics |
| GET | `/activity-analytics` | Activity booking analytics |
| GET | `/pending-reviews` | Reviews awaiting approval |
| PUT | `/reviews/:id/approve` | Approve a review |

### Payment Routes (`/api/payment`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify` | Verify payment signature |

---

## AI Services

All AI services run on FastAPI at `http://localhost:8001`

### POST `/chat`
```json
Request:  { "message": "Best farm to visit in Kerala?", "history": [] }
Response: { "reply": "I recommend Munnar tea estates..." }
```

### POST `/detect-disease`
```
Request:  multipart/form-data with image file
Response: { "plant_name": "Tomato", "disease": "Late Blight",
            "confidence": 92, "severity": "High", "treatment": "..." }
```

### POST `/recommend`
```json
Request:  { "groupType": "family", "budget": "mid range", 
            "duration": "2-3 days", "interest": "farming",
            "season": "winter", "state": "Kerala" }
Response: { "summary": "...", "destinations": [...], 
            "activities": [...], "bestTime": "...", "tip": "..." }
```

---

## Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/verify-otp` | OTP Verification | Public |
| `/forgot-password` | Forgot Password | Public |
| `/verify-reset-otp` | Reset OTP | Public |
| `/reset-password` | Reset Password | Public |
| `/google-callback` | Google OAuth Callback | Public |
| `/places` | All Destinations | Public |
| `/places/:id` | Destination Details | Public |
| `/activities` | All Activities | Public |
| `/activities/:id` | Activity Details | Public |
| `/culture` | Culture & Festivals | Public |
| `/culture/:id` | Festival Details | Public |
| `/birds` | Bird Watching | Public |
| `/blogs` | Agriculture News | Public |
| `/book-now` | Booking Page | Auth |
| `/chatbot` | AI Chatbot | Public |
| `/disease-detector` | Plant Disease AI | Public |
| `/recommendation` | Trip Recommender AI | Public |
| `/dashboard` | User Dashboard | Auth |
| `/edit-profile` | Edit Profile | Auth |
| `/admin-dashboard` | Admin Panel | Admin |

---

## Future Scope

| Feature | Priority | Description |
|---------|----------|-------------|
| 🌐 Multilingual Support | HIGH | Hindi, Marathi, Tamil, Telugu, English using react-i18next |
| 📱 Mobile App | HIGH | React Native iOS and Android application |
| 🥽 AR Farm Tours | MEDIUM | Augmented reality farm walkthroughs |
| 📡 IoT Integration | MEDIUM | Real-time crop and weather sensor data |
| 🎥 Farmer Video Calls | MEDIUM | Direct connect with farmers before booking |
| 🌱 Carbon Tracker | LOW | Eco-score for each farm stay |
| 🏛️ Govt Integration | LOW | Ministry of Agriculture scheme links |
| ⛓️ Blockchain Certs | LOW | Verified organic farm certificates |

---

## Team

**TYBSCIT Student**
Department of Information Technology
Academic Year 2025–26

---

## License

This project was built as a final year academic project for TYBSCIT.
All rights reserved © 2026 AgroVista Team.

---

<div align="center">
  <strong>🌿 AgroVista — Connecting India's Farms to the World 🌾</strong>
  <br/>
  <em>Built with React · Node.js · FastAPI · PostgreSQL · Google Gemini AI</em>
</div>