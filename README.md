# 🚆 .Train  
## Real-Time Train Tracking & Network Alert System  

Full Stack Django Web Application  

**Version:** 1.0  
**Status:** Draft  
**Authors:** Pratap Narayan Choubey & Arushi Goswami  

---

# 📘 System Architecture Document

---

# 📑 Table of Contents

1. Introduction  
2. System Overview  
3. Architecture Overview  
4. Logical Architecture  
5. Physical Architecture  
6. Data Architecture  
7. Application Architecture  
8. Network Alert System  
9. Interface Design  
10. Security Architecture  
11. Requirements Traceability  
12. External API & Live Simulation Architecture  

---

# 1. INTRODUCTION

## 1.1 Document Overview

This document presents the complete system architecture of the “.Train” web application.

It provides a detailed description of:

- Logical architecture  
- Physical deployment  
- Software components  
- Database design  
- Integrated network alert system  

It serves as a technical reference for developers, stakeholders, and evaluators.

---

## 1.2 Purpose

The primary purpose of this application is to:

- Track trains in real-time  
- Display current location & station details  
- Show ETA and delay status  
- Alert users before low-network zones  
- Provide offline access to critical journey data  

---

## 1.3 Scope

This document covers:

- Django backend architecture  
- HTML + Tailwind CSS frontend  
- SQLite database schema  
- Network alert detection system  
- Offline caching mechanism  

Source code implementation is not included.

---

## 1.4 Abbreviations & Glossary

| Term | Definition |
|------|------------|
| MVT | Model-View-Template (Django pattern) |
| ORM | Object Relational Mapping |
| ETA | Estimated Time of Arrival |
| API | Application Programming Interface |
| SQLite | Lightweight file-based database |
| CRUD | Create, Read, Update, Delete |

---

# 2. SYSTEM OVERVIEW

## 2.1 System Context

### External Systems
- Railway Data API  
- Leaflet + OpenStreetMap  
- Weather API  

### Internal Components
- Django Backend  
- SQLite Database  
- HTML + Tailwind Frontend  

### Users
- Commuters  
- Travelers  
- Railway Staff  

### Context Flow

External APIs  
↓  
Django Backend  
↓  
SQLite Database  
↓  
Frontend UI  
↓  
Users  

---

## 2.2 Design Goals

- Reliability  
- Performance (< 2 seconds response)  
- Usability  
- Offline Access  
- Scalability (PostgreSQL migration ready)

---

## 2.3 Target Users

- Daily commuters  
- Long-distance travelers  
- Users in poor network regions  

---

# 3. ARCHITECTURE OVERVIEW

## 3.1 Three-Layer Architecture

### 1. Client Layer
- Web Browser  
- Mobile Browser  
- Service Worker  

### 2. Application Layer (Django)
- urls.py  
- views.py  
- models.py  
- Templates (HTML + Tailwind)

### 3. Database Layer
SQLite (db.sqlite3)

Tables:
- trains  
- stations  
- routes  
- train_status  
- network_zones  
- users  

---

## 3.2 Technology Stack

| Layer | Technology | Purpose |
|--------|------------|----------|
| Backend | Django 5.x | Web Framework |
| Backend | Django ORM | DB abstraction |
| Frontend | HTML5 | Structure |
| Frontend | Tailwind CSS | Styling |
| Frontend | JavaScript | Interactivity |
| Database | SQLite | Data Storage |
| Maps | Leaflet.js + OSM | Visualization |
| Offline | Service Workers | Caching |

---

## 3.3 Django MVT Pattern

Flow:

User → URL Router → View → Model → Database  
                     ↓  
                 Template  
                     ↓  
                    User  

Ensures:
- Separation of concerns  
- Maintainability  
- Scalability  

---

# 4. LOGICAL ARCHITECTURE

## Applications

### Tracker App

Models:
- Train  
- Station  
- Route  
- TrainStatus  
- NetworkZone  

Views:
- HomeView  
- TrainTrackerView  
- ScheduleView  
- StationView  
- NetworkAlertView  

Templates:
- home.html  
- tracker.html  
- schedule.html  
- station.html  
- alert.html  

---

### User App

Models:
- UserProfile  
- SavedTrain  
- SearchHistory  

Views:
- ProfileView  
- LoginView  
- RegisterView  

---

## Project Structure
train_project/
│
├── manage.py
├── db.sqlite3
├── requirements.txt
│
├── train_project/
│ ├── settings.py
│ ├── urls.py
│ ├── wsgi.py
│ └── asgi.py
│
├── tracker/
│ ├── models.py
│ ├── views.py
│ ├── urls.py
│ └── forms.py
│
├── templates/
├── static/

---

# 5. PHYSICAL ARCHITECTURE

## Development Environment

- Local machine  
- Django dev server  
- SQLite  
- GitHub  

Run:


---

## Production Environment

Users  
↓  
Nginx  
↓  
Gunicorn  
↓  
Django  
↓  
SQLite / PostgreSQL  

---

## Hardware Requirements

| Component | Development | Production |
|------------|-------------|------------|
| OS | Windows/macOS/Linux | Ubuntu 22.04 |
| RAM | 4 GB | 8 GB |
| Storage | 1 GB | 10 GB |
| Server | Dev Server | Nginx + Gunicorn |

---

# 6. DATA ARCHITECTURE

## Database Configuration

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```
ERD (Logical)

TRAIN ───< ROUTE >─── STATION
│
▼
TRAIN_STATUS
│
▼
NETWORK_ZONE

7. APPLICATION ARCHITECTURE
URL Structure

/

/train/<id>/

/schedule/

/station/<code>/

/alerts/

/api/location/<id>/

8. NETWORK ALERT SYSTEM

Workflow:

Get train position

Check zone proximity

If within 10 km:

Calculate ETA

Trigger alert

Cache data

Enable offline mode

Offline Mode:

Service Worker → Cached Data → Display

9. INTERFACE DESIGN

User Flow:

Home → Search → Train Tracker → Map → Network Alert

10. SECURITY ARCHITECTURE

CSRF Protection

XSS Protection

SQL Injection Prevention

HTTPS

Secure Cookies

HSTS

11. REQUIREMENTS TRACEABILITY
ID	Requirement	Component
REQ-001	Live tracking	TrainTrackerView
REQ-002	Schedule display	ScheduleView
REQ-003	ETA calculation	TrainTrackerView
REQ-004	Network alerts	NetworkAlertView
REQ-005	Offline caching	Service Worker
REQ-006	Map display	Leaflet.js
REQ-007	Train search	HomeView
REQ-008	Delay status	TrainStatus
REQ-009	Responsive UI	Tailwind
REQ-010	Station details	StationDetailView
12. EXTERNAL API & LIVE SIMULATION ARCHITECTURE
RapidAPI Flow

RapidAPI
↓
fetch_external_train_status()
↓
normalize_train_data()
↓
Cache + Timeline Logic
↓
Final API Response

ETA Formula

ETA = Current_Time + (Distance_Remaining / Average_Speed)

Interpolation Formula

Current_Position = Start_Location + (Speed × Time_Elapsed)

High Concurrency Strategy

Intelligent caching

Avoid repeated API calls

Under 2 second response

Voice Assistant Flow

Speech → Text → NLP Intent → Autofill → API Call

✅ System Strength Summary

Real-time tracking

Heuristic network prediction

1000+ user scalability

Offline backup (45 min validity)

Smooth interpolation

Voice-enabled search

Stable external API integration

📄 Document Revision History
Version	Authors	Changes
1.0	Pratap Narayan Choubey & Arushi Goswami	Initial creation
