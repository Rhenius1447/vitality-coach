# Project Documentation  
## Vitality Coach – AI-Powered Health Tracking System

---

## 1. Introduction

Vitality Coach is a web-based health tracking application that allows users to record daily wellness data and receive AI-based health recommendations.

The system securely stores user data and provides insights to encourage healthier lifestyle habits.

---

## 2. Objectives

- Develop a secure health monitoring system  
- Implement AI-based recommendation logic  
- Ensure user data privacy using authentication  
- Provide a responsive and user-friendly interface  

---

## 3. System Overview

The system consists of:

1. Authentication Module  
2. Health Log Module  
3. AI Recommendation Engine  
4. Dashboard Module  
5. Profile Management  

Supabase is used for authentication and database management.

---

## 4. Key Features

- User registration and login  
- Daily health logging (sleep, water, exercise, mood, notes)  
- AI-generated health suggestions  
- Dashboard displaying recent logs and insights  
- Secure data storage with Row-Level Security  

---

## 5. Technology Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Supabase, PostgreSQL  
**State Management:** React Context API  
**Testing:** Vitest  

---

## 6. Database Design

### profiles
- id (uuid)  
- full_name  
- email  
- created_at  

### health_logs
- id (uuid)  
- user_id (foreign key)  
- sleep_hours  
- water_intake  
- exercise_minutes  
- mood  
- notes  
- created_at  

---

## 7. Conclusion

Vitality Coach demonstrates the integration of modern frontend technologies with a secure backend to create an AI-powered health monitoring system.  

The project highlights modular design, secure authentication, and intelligent recommendation generation.

---

## Author

Rhenius N  
B.Tech Computer Science Engineering  

---
