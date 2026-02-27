#.Train

Real-Time Train Tracking & Network Alert System

Full Stack Django Web Application

Version: 1.0
Status: Draft
Authors: Pratap Narayan Choubey & Arushi Goswami

📘 System Architecture Document
📑 Table of Contents

Introduction

System Overview

Architecture Overview

Logical Architecture

Physical Architecture

Data Architecture

Application Architecture

Network Alert System

Interface Design

Security Architecture

Requirements Traceability

External API & Live Simulation Architecture

1. INTRODUCTION
1.1 Document Overview

This document presents the complete system architecture of the “.Train” web application.

It provides a detailed description of:

Logical architecture

Physical deployment

Software components

Database design

Integrated network alert system

It serves as a technical reference for developers, stakeholders, and evaluators.

1.2 Purpose

The primary purpose of this application is to:

🚆 Track trains in real-time

📍 Display current location & station details

⏱ Show ETA and delay status

📡 Alert users before low-network zones

💾 Provide offline access to critical journey data

1.3 Scope

This document covers:

Django backend architecture

HTML + Tailwind CSS frontend

SQLite database schema

Network alert detection system

Offline caching mechanism

Source code implementation is not included.

1.4 Abbreviations & Glossary
Term	Definition
MVT	Model-View-Template (Django pattern)
ORM	Object Relational Mapping
ETA	Estimated Time of Arrival
API	Application Programming Interface
SQLite	Lightweight file-based database
CRUD	Create, Read, Update, Delete
2. SYSTEM OVERVIEW
2.1 System Context
External Systems

Railway Data API

Leaflet + OpenStreetMap

Weather API

Internal Components

Django Backend

SQLite Database

HTML + Tailwind Frontend

Users

Commuters

Travelers

Railway Staff

Context Flow
External APIs
      ↓
   Django Backend
      ↓
   SQLite Database
      ↓
   Frontend UI
      ↓
     Users
2.2 Design Goals

Reliability

Performance (< 2 seconds response)

Usability

Offline Access

Scalability (PostgreSQL migration ready)

2.3 Target Users

Daily commuters

Long-distance travelers

Users in poor network regions

3. ARCHITECTURE OVERVIEW
3.1 Three-Layer Architecture
1️⃣ Client Layer

Web Browser

Mobile Browser

Service Worker

2️⃣ Application Layer (Django)

urls.py

views.py

models.py

Templates (HTML + Tailwind)

3️⃣ Database Layer

SQLite (db.sqlite3)

Tables:

trains

stations

routes

train_status

network_zones

users

3.2 Technology Stack
Layer	Technology	Purpose
Backend	Django 5.x	Web Framework
Backend	Django ORM	DB abstraction
Frontend	HTML5	Structure
Frontend	Tailwind CSS	Styling
Frontend	JavaScript	Interactivity
Database	SQLite	Data Storage
Maps	Leaflet.js + OSM	Visualization
Offline	Service Workers	Caching
3.3 Django MVT Pattern

Flow:

User → URL Router → View → Model → Database
                      ↓
                   Template
                      ↓
                     User

Ensures:

Separation of concerns

Maintainability

Scalability

4. LOGICAL ARCHITECTURE
4.1 Applications
Tracker App

Models:

Train

Station

Route

TrainStatus

NetworkZone

Views:

HomeView

TrainTrackerView

ScheduleView

StationView

NetworkAlertView

Templates:

home.html

tracker.html

schedule.html

station.html

alert.html

User App

Models:

UserProfile

SavedTrain

SearchHistory

Views:

ProfileView

LoginView

RegisterView

4.2 Project Structure
train_project/
│
├── manage.py
├── db.sqlite3
├── requirements.txt
│
├── train_project/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── tracker/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── forms.py
│
├── templates/
├── static/
5. PHYSICAL ARCHITECTURE
5.1 Development Environment

Local machine

Django dev server

SQLite

GitHub

Run:

python manage.py runserver
5.2 Production Environment

Users
↓
Nginx
↓
Gunicorn
↓
Django
↓
SQLite / PostgreSQL

Ensures:

Security

Performance

Production-grade setup

5.3 Hardware Requirements
Component	Development	Production
OS	Windows/macOS/Linux	Ubuntu 22.04
RAM	4 GB	8 GB
Storage	1 GB	10 GB
Server	Dev Server	Nginx + Gunicorn
6. DATA ARCHITECTURE
6.1 Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
6.2 ERD (Logical)
TRAIN ───< ROUTE >─── STATION
   │
   ▼
TRAIN_STATUS
   │
   ▼
NETWORK_ZONE
6.3 Tables
trains

id

train_number

name

train_type

source_station_id

dest_station_id

current_status

stations

id

station_code

name

latitude

longitude

zone

platform_count

routes

train_id

station_id

arrival_time

departure_time

sequence_order

distance_km

train_status

train_id

current_lat

current_lng

delay_minutes

updated_at

network_zones

zone_name

start_km

end_km

signal_strength

connectivity

alert_message

7. APPLICATION ARCHITECTURE
7.1 URL Structure
URL	View
/	HomeView
/train/<id>/	TrainTrackerView
/schedule/	ScheduleView
/station/<code>/	StationDetailView
/alerts/	NetworkAlertView
/api/location/<id>/	LocationAPIView
7.2 Key Views
HomeView

Search trains

Show popular trains

TrainTrackerView

Live map

Delay info

Journey progress

NetworkAlertView

Detect low-network zones

Trigger offline caching

8. NETWORK ALERT SYSTEM
Architecture

Zone Database

Detection Engine

Alert Manager

Workflow

Get train position

Check zone proximity

If within 10 km:

Calculate ETA

Trigger alert

Cache data

Enable offline mode

Offline Mode

Online:

Browser → Django → DB → Response

Offline:

Service Worker → Cached Data → Display

Cached Data:

Current location

Next 5 stations

Delay status

Platform info

9. INTERFACE DESIGN
User Flow

Home
→ Search
→ Train Tracker
→ Map
→ Network Alert

Home Page Layout

Navbar

Search bar

Popular trains

Clean Tailwind UI

Train Tracker Layout

Journey timeline

Live map

Delay status

Network alert banner

10. SECURITY ARCHITECTURE
Django Security

CSRF protection

XSS protection

SQL injection prevention

Clickjacking protection

Production Security

HTTPS

SSL/TLS

Secure cookies

HSTS

Nginx reverse proxy

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
12.1 RapidAPI Integration Flow

RapidAPI
↓
fetch_external_train_status()
↓
normalize_train_data()
↓
Cache + Timeline Logic
↓
Final API Response

12.2 Heuristic Network Prediction

Assumption:

Long distance between stations → Higher chance of low connectivity

Used because:

No telecom API available

Logical & interview-safe

12.3 ETA Formula
ETA = Current_Time + (Distance_Remaining / Average_Speed)
12.4 Train Movement Interpolation
Current_Position =
Start_Location + (Speed × Time_Elapsed)

Creates smooth live animation.

12.5 High Concurrency (1000+ Users)

Strategy:

Intelligent caching

Avoid repeated API calls

Under 2 second response

12.6 Offline Backup

When near zone:

Pre-cache data

Store 45-minute prediction

Enable Service Worker

Ensures:

No UI freeze

No blank screen

12.7 Voice Assistant

Speech → Text → NLP Intent → Autofill → API Call

Supports:

Hands-free search

Accessibility

Smart interaction

✅ System Strength Summary

Real-time tracking

Heuristic network prediction

1000+ user scalability

Offline backup (45 min)

Smooth map interpolation

Voice-enabled search

Stable external API integration

📄 Document Revision History
Version	Authors	Changes
1.0	Pratap Narayan Choubey & Arushi Goswami	Initial creation
