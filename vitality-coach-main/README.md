# Vitality Coach – AI-Powered Health Tracking System

---

## Project Overview

**Vitality Coach** is a web-based health monitoring application that helps users track daily wellness activities and receive AI-driven health recommendations.

The system provides:

- Structured daily health logging  
- Secure user authentication  
- Personalized AI-based insights  
- Real-time dashboard overview  

---

## Key Features

### User Authentication
- Email & password login  
- Secure session management  
- Protected routes  
- Supabase authentication  

---

### Health Logging System
Users can record:

- Sleep hours  
- Water intake  
- Exercise duration  
- Mood  
- Notes  

All logs are securely stored and linked to the authenticated user.

---

### AI Recommendation Engine
The system analyzes health logs and:

- Detects low sleep patterns  
- Identifies dehydration  
- Flags low physical activity  
- Generates improvement suggestions  

---

### Dashboard Overview
Displays:

- Recent health logs  
- AI-generated recommendations  
- Total logs recorded  
- Health activity summary  

---

### Responsive UI
- Clean card-based layout  
- Fully responsive design  
- Light & Dark mode support  

---

## Technologies Used

- **Frontend:** React + TypeScript  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS  
- **UI Library:** ShadCN  
- **Backend:** Supabase  
- **Database:** PostgreSQL  
- **State Management:** React Context API  
- **Testing:** Vitest  

---

## System Architecture

Core Modules:

1. Authentication Module  
2. Health Log Module  
3. AI Analysis Engine  
4. Dashboard Module  
5. Profile Management  

The system uses Supabase with Row-Level Security (RLS) to ensure secure data isolation.

---

## Database Schema

### `profiles`
- id (uuid)  
- full_name  
- email  
- created_at  

### `health_logs`
- id (uuid)  
- user_id (foreign key)  
- sleep_hours  
- water_intake  
- exercise_minutes  
- mood  
- notes  
- created_at  

---

## Project Structure

vitality-coach/
│
├── public/
├── src/
│ ├── components/
│ ├── contexts/
│ ├── hooks/
│ ├── lib/
│ ├── pages/
│ └── integrations/
│
├── supabase/
├── package.json
└── README.md


---

## Installation & Setup

### Clone Repository

git clone https://github.com/your-username/vitality-coach.git


### Install Dependencies

npm install


### Run Application

npm run dev


Application runs at:

http://localhost:5173


---

## Author

Rhenius N  
B.Tech Computer Science Engineering  

---
