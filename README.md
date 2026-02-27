# .Train

	SYSTEM ARCHITECTURE DOCUMENT
	   		Full Stack Project Documentation


Project:  .Train – Real-Time Train Tracking & Network Alert System



1. Document Information
Field
Value
Document Title
System Architecture Document
Project Name
 .Train webapp
Version
1.0
Author
Pratap Narayan Choubey & Arushi Goswami
Status
Draft










 TABLE OF CONTENTS

1. Introduction
1.1 Document Overview
1.2 Purpose
1.3 Scope
1.4 Abbreviations and Glossary

2. System Overview
2.1 System Context
2.2 Design Goals
2.3 Target Users

3. Architecture Overview
3.1 High-Level Architecture Diagram
3.2 Technology Stack
3.3 Django MVT Pattern

4. Logical Architecture
4.1 Software Component Diagram
4.2 Component Descriptions
4.3 Module Structure

5. Physical Architecture
5.1 Deployment Diagram
5.2 Hardware / Server Requirements

6. Data Architecture
6.1 Database Design (SQLite)
6.2 Entity Relationship Diagram (ERD)
6.3 Data Dictionary

7. Application Architecture
7.1 URL Routing Structure
7.2 Views Architecture
7.3 Templates Structure

8. Network Alert System
8.1 Alert System Architecture
8.2 Workflow Diagram
8.3 Offline Support

9. Interface Design
9.1 User Interface Flow
9.2 Screen Layouts

10. Security Architecture

 1. INTRODUCTION

1.1 Document Overview
This document presents the complete system architecture of the “ .Train” web application. It provides a detailed description of the system’s logical architecture, physical deployment structure, software components, database design, and the integrated network alert system.
The document serves as a technical reference for developers, stakeholders, and system evaluators by explaining how different components interact to deliver real-time train tracking and offline support functionality.

1.2 Purpose
The primary purpose of this application is to provide users with reliable, real-time train journey information along with intelligent network-aware alerts. The system is designed to:
    • Track trains in real-time, displaying current location and station details
    • Present comprehensive journey information, including Estimated Time of Arrival (ETA) and delay status
    • Alert users before entering low-network connectivity zones
    • Provide offline access to critical journey data to ensure uninterrupted user experience

1.3 Scope
This document covers the following architectural and technical aspects of the system:
    • Django-based backend architecture
    • HTML and Tailwind CSS-based frontend design
    • SQLite database schema and data structure
    • Network alert detection system
    • Offline caching mechanism for journey data
The document focuses specifically on system-level design and does not include detailed source code implementation.


1.4 Abbreviations and Glossary
Term
Definition
MVT
Model-View-Template (Django’s architectural pattern)
ORM
Object-Relational Mapping
ETA
Estimated Time of Arrival
API
Application Programming Interface
SQLite
Lightweight file-based database
CRUD
Create, Read, Update, Delete operations
 2. SYSTEM OVERVIEW

2.1 System Context Diagram
The Train system operates within an ecosystem of external services and end users. It integrates railway data, mapping services, and weather APIs to provide real-time train tracking and alerts.
External Systems
    • Railway Data API
    • Maps API (Leaflet + OpenStreetMap)
    • Weather API
Internal System Components
    • Django Backend
    • SQLite Database
    • Frontend (HTML + Tailwind CSS)
Users
    • Commuters
    • Travelers
    • Railway Staff
Context Representation (Textual View)
External Systems
   ├── Railway Data API
   ├── Maps API (Leaflet)
   └── Weather API
            │
            ▼
        "Train" System
   ├── Django Backend
   ├── SQLite Database
   └── Frontend (HTML/Tailwind)
            │
            ▼
           Users
   ├── Commuters
   ├── Travelers
   └── Railway Staff
The system fetches live data from external APIs, processes it through the Django backend, stores relevant information in SQLite, and displays it to users through a responsive web interface.

2.2 Design Goals
The architectural design of the Train system is guided by the following goals:
    • Reliability – Accurate real-time train tracking
    • Performance – Fast response times (less than 2 seconds)
    • Usability – Simple and intuitive user interface
    • Offline Access – Critical journey data accessible without internet
    • Scalability – Easy migration to PostgreSQL if required

2.3 Target Users
The system is designed for:
    • Daily commuters tracking regular trains
    • Long-distance travelers monitoring journey progress
    • Users in regions with poor network connectivity

3. ARCHITECTURE OVERVIEW

3.1 High-Level Architecture
The Train system follows a three-layer architecture:
1. Client Layer
    • Web Browser (Desktop/Laptop)
    • Mobile Browser (Responsive Design)
    • Service Worker (Offline Cache)
2. Application Layer (Django Framework)
URL Dispatcher (urls.py)
    • / → Home
    • /train/<id>/ → Track Train
    • /search/ → Search
Views (views.py)
    • HomeView
    • TrackView
    • SearchView
    • AlertView
Models (models.py)
    • Connected to SQLite using Django ORM
Templates
    • HTML + Tailwind CSS
3. Database Layer
SQLite Database (db.sqlite3)
Tables:
    • trains
    • stations
    • routes
    • train_status
    • network_zones
    • users

3.2 Technology Stack
Layer
Technology
Purpose
Backend
Django 5.x
Web Framework
Backend
Django ORM
Database Abstraction
Frontend
HTML5
Structure
Frontend
Tailwind CSS
Styling
Frontend
JavaScript
Interactivity
Database
SQLite3
Data Storage
Maps
Leaflet.js + OpenStreetMap
Train Visualization
Offline Support
Service Workers + LocalStorage
Caching

3.3 Django MVT Pattern
The system follows Django’s Model-View-Template (MVT) architectural pattern.
Flow Description
    1. User sends an HTTP request to the server.
    2. URL Dispatcher routes the request to the appropriate View.
    3. View interacts with the Model using Django ORM.
    4. Model retrieves data from SQLite database.
    5. View sends context data to Template.
    6. Template renders HTML response and returns it to the user.
Logical Flow Representation
User → URL Router → View → Model → Database
                       ↓
                    Template
                       ↓
                      User
This pattern ensures separation of concerns, maintainability, and scalability.

4. LOGICAL ARCHITECTURE

4.1 Software Component Structure
The Django application is divided into modular components.
Main Applications
1. Tracker App
Models
    • Train
    • Station
    • Route
    • TrainStatus
    • NetworkZone
Views
    • HomeView
    • TrainTrackerView
    • ScheduleView
    • StationView
    • NetworkAlertView
Templates
    • home.html
    • tracker.html
    • schedule.html
    • station.html
    • alert.html

2. User App
Models
    • UserProfile
    • SavedTrain
    • SearchHistory
Views
    • ProfileView
    • LoginView
    • RegisterView
Templates
    • profile.html
    • login.html

Static Files
    • css/tailwind.css
    • js/map.js
    • js/network_check.js
    • images/

4.2 Component Descriptions
Component
Description
Train
Core model storing train number, name, and type
Station
Railway station details with geo-coordinates
Route
Mapping between trains and stations with schedule
TrainStatus
Real-time location and delay data
NetworkZone
Low or no-connectivity areas
HomeView
Landing page with train search
TrainTrackerView
Live tracking with map visualization
ScheduleView
Train schedule search
NetworkAlertView
Detects low network zones and triggers alerts

4.3 Module Structure (Project Directory)
train_project/
│
├── manage.py
├── db.sqlite3
├── requirements.txt
│
├── train_project/               # Project Configuration
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── tracker/                     # Main Application
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── forms.py
│   ├── admin.py
│   └── tests.py
│
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── train_tracker.html
│   ├── schedule.html
│   ├── station_detail.html
│   └── components/
│       ├── navbar.html
│       ├── train_card.html
│       ├── station_timeline.html
│       └── network_alert.html
│
└── static/
    ├── css/
    │   └── tailwind.css
    ├── js/
    │   ├── map.js
    │   ├── network_check.js
    │   └── offline.js
    └── images/
        └── train_icons/
5. PHYSICAL ARCHITECTURE
The Physical Architecture defines how the Train system is deployed in both development and production environments. It describes the infrastructure setup, hosting configuration, and hardware requirements necessary to run the application efficiently.

5.1 Deployment Diagram
The system deployment is divided into two major environments:
    • Development Environment
    • Production Environment

5.1.1 Development Environment
The development setup is used by developers to build, test, and debug the application locally.
Components:
    • Developer Machine
    • Django Development Server
    • SQLite Database (db.sqlite3)
    • GitHub Repository (Version Control)
Deployment Flow (Development)
Developer Machine
    │
    ├── Django Development Server
    │      (python manage.py runserver)
    │
    ├── SQLite Database (db.sqlite3)
    │
    └── GitHub Repository (Version Control)
Working Process:
    1. Developer writes and modifies code locally.
    2. Django development server runs the application.
    3. SQLite database stores application data locally.
    4. Code is pushed to GitHub for version control and collaboration.
This environment is lightweight and suitable for rapid development and testing.

5.1.2 Production Environment
The production environment hosts the live system accessed by end users.
Components:
    • Users (Web Browsers)
    • Web Server (Nginx)
    • WSGI Server (Gunicorn)
    • Django Application
    • SQLite Database (or PostgreSQL in scalable setups)
Deployment Flow (Production)
Users (Web Browsers)
        │
       HTTPS
        ▼
     Nginx (Web Server)
        ▼
     Gunicorn (WSGI Server)
        ▼
     Django Application
        ▼
     SQLite Database
Working Process:
    1. Users access the system via HTTPS.
    2. Nginx acts as a reverse proxy and handles static files.
    3. Gunicorn runs the Django application.
    4. Django processes requests and interacts with the database.
    5. The database returns data to the application.
    6. Response is sent back securely to the user.
This layered architecture ensures:
    • Improved security
    • Better performance
    • Separation of responsibilities
    • Production-grade deployment standards

5.2 Hardware / Server Requirements
The following table outlines minimum and recommended hardware specifications.
Component
Development Environment
Production Environment
Operating System
Windows / macOS / Linux
Ubuntu 22.04 LTS
Python Version
3.10+
3.10+
RAM
4 GB minimum
8 GB recommended
Storage
1 GB
10 GB
Web Server
Django Development Server
Nginx + Gunicorn
Database
SQLite (db.sqlite3)
SQLite (or PostgreSQL for scalability)

6. DATA ARCHITECTURE
The Data Architecture defines how data is stored, structured, and managed within the Train system. It includes database configuration, entity relationships, and detailed schema definitions.

6.1 Database Configuration (Django – settings.py)
The system uses SQLite as the default database for development and lightweight production deployment.
# SQLite Configuration (Django Default)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
SQLite is a file-based database that requires no separate server process, making it ideal for small-to-medium scale deployments.

6.2 Entity Relationship Diagram (ERD)
The following entities form the core of the Train system database:
Main Entities:
    • Train
    • Station
    • Route
    • TrainStatus
    • NetworkZone
ERD Structure (Logical Representation)
TRAIN ──────< ROUTE >────── STATION
   │                          │
   │                          │
   ▼                          ▼
TRAIN_STATUS              NETWORK_ZONE
Relationship Explanation
    • A Train has many Route entries.
    • A Route links a Train to multiple Stations in sequence.
    • A TrainStatus stores real-time tracking data for a Train.
    • A NetworkZone stores low-connectivity region data used by the alert system.

6.3 Data Dictionary
Below is the detailed schema definition for each database table.

TABLE: trains
Column
Type
Nullable
Description
id
INTEGER
NO
Primary key (auto-increment)
train_number
VARCHAR(10)
NO
Unique train number (e.g., 12301)
name
VARCHAR(100)
NO
Train name
train_type
VARCHAR(50)
NO
Express, Superfast, etc.
source_station_id
INTEGER
NO
Foreign key to stations
dest_station_id
INTEGER
NO
Foreign key to stations
current_status
VARCHAR(20)
NO
On Time / Delayed / Cancelled

TABLE: stations
Column
Type
Nullable
Description
id
INTEGER
NO
Primary key
station_code
VARCHAR(10)
NO
Unique station code (e.g., NDLS)
name
VARCHAR(100)
NO
Full station name
latitude
FLOAT
NO
Geographic latitude
longitude
FLOAT
NO
Geographic longitude
zone
VARCHAR(50)
NO
Railway zone
platform_count
INTEGER
NO
Number of platforms

TABLE: routes
Column
Type
Nullable
Description
id
INTEGER
NO
Primary key
train_id
INTEGER
NO
Foreign key to trains
station_id
INTEGER
NO
Foreign key to stations
arrival_time
TIME
YES
Scheduled arrival
departure_time
TIME
YES
Scheduled departure
sequence_order
INTEGER
NO
Stop order (1,2,3…)
distance_km
INTEGER
NO
Distance from source

TABLE: train_status
Column
Type
Nullable
Description
id
INTEGER
NO
Primary key
train_id
INTEGER
NO
Foreign key to trains
current_lat
FLOAT
NO
Current latitude
current_lng
FLOAT
NO
Current longitude
last_station_id
INTEGER
YES
Last passed station
delay_minutes
INTEGER
NO
Delay in minutes
updated_at
DATETIME
NO
Last update timestamp

TABLE: network_zones
Column
Type
Nullable
Description
id
INTEGER
NO
Primary key
zone_name
VARCHAR(100)
NO
Low-network area name
start_km
INTEGER
NO
Start kilometer
end_km
INTEGER
NO
End kilometer
signal_strength
INTEGER
NO
Signal level (0–5)
connectivity
VARCHAR(20)
NO
good / poor / none
alert_message
TEXT
NO
Warning message

7. APPLICATION ARCHITECTURE
This section describes URL routing, view structure, and template organization.

7.1 URL Routing Structure
URL Pattern
View
Function
/
HomeView
Landing page with search
/train/<train_no>/
TrainTrackerView
Live train tracking
/train/<train_no>/map/
TrainMapView
Full-screen map
/schedule/
ScheduleView
Search schedules
/schedule/<train_no>/
ScheduleDetailView
Detailed timetable
/station/<code>/
StationDetailView
Station information
/alerts/
NetworkAlertView
Network alerts
/api/location/<train_no>/
LocationAPIView
JSON live location
/api/alerts/<train_no>/
AlertAPIView
JSON alert data

7.2 Views Architecture
HomeView
Purpose:
    • Display landing page
    • Handle search form
    • Show popular trains
Methods:
    • get() – Render page
    • post() – Process search

TrainTrackerView
Purpose:
    • Show live train location
    • Display journey progress
    • Show delay status
    • Render map with marker
Methods:
    • get() – Fetch train data

ScheduleView
Purpose:
    • Search trains by route
    • Display timetables
    • Filter by date/type
Methods:
    • get() – Render search page
    • post() – Return results

NetworkAlertView
Purpose:
    • Detect low network zones
    • Generate alert messages
    • Trigger offline caching
Methods:
    • get() – Check zones
    • get_alert_data() – Provide alert details

LocationAPIView
Purpose:
    • REST API endpoint
    • Return JSON location data
    • Used for AJAX map updates

7.3 Templates Structure
Base Layout (base.html)
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
    <link href="tailwind.css" rel="stylesheet">
</head>
<body>
    {% include 'components/navbar.html' %}
    {% include 'components/network_alert.html' %}
    <main>{% block content %}{% endblock %}</main>
    {% include 'components/footer.html' %}
</body>
</html>
Template Hierarchy
templates/
│
├── base.html
├── home.html
├── train_tracker.html
├── schedule.html
├── station_detail.html
│
└── components/
    ├── navbar.html
    ├── train_card.html
    ├── station_timeline.html
    ├── network_alert.html
    └── footer.html

8. NETWORK ALERT SYSTEM
The Network Alert System ensures uninterrupted user experience when entering low connectivity zones.

8.1 Alert System Architecture
Core Components:
    1. Zone Database (NetworkZone Model)
    2. Detection Engine
    3. Alert Manager
Functional Flow
    • Compare train position with predefined zone boundaries
    • Calculate ETA to zone entry
    • Generate alert message
    • Trigger UI banner
    • Activate caching mechanism

8.2 Workflow Description
    1. System receives Train ID.
    2. Fetch current train position.
    3. Query NetworkZone database.
    4. Check if train is within 10 km of low network zone.
    5. If YES:
        ◦ Calculate ETA
        ◦ Generate alert
        ◦ Display banner
        ◦ Cache critical data
        ◦ Enable offline mode
    6. If NO:
        ◦ Continue normal operation

8.3 Offline Support Architecture
Online Mode
Browser → Django Server → SQLite → Response
Alert Triggered
Alert → Service Worker Activated → Cache Train Data → Store in Local Storage / IndexedDB
Offline Mode
Browser Request → Service Worker Intercepts → Read Cached Data → Display Offline Content

Data Cached for Offline Access:
    • Current train position
    • Next 5 stations with arrival times
    • Delay status
    • Platform information
    • Estimated time to exit low-network zone
 9. INTERFACE DESIGN
This section describes the user interaction flow and visual structure of the Train web application.

9.1 User Interface Flow
The user interface is designed for simplicity and intuitive navigation.
Navigation Flow
HOME PAGE
   │
   ├── Search Results
   ├── Train Tracker
   │       └── Live Map View
   │               └── Network Alert (Popup)
   ├── Schedule Search
   ├── Station Detail
   └── Profile Page
Flow Explanation
    1. User lands on the Home Page.
    2. User can:
        ◦ Search for a train
        ◦ Open Train Tracker directly
        ◦ Search schedules
        ◦ View station details
        ◦ Access profile
    3. Inside Train Tracker:
        ◦ User views live map
        ◦ System may trigger network alert popup
    4. If approaching a low-network zone:
        ◦ Alert banner appears
        ◦ Offline caching is initiated
This flow ensures smooth navigation with minimal clicks.

9.2 Screen Layouts
9.2.1 Home Page Wireframe
---------------------------------------------------------------
[Logo] Train      [Search] [Schedule] [Login]
---------------------------------------------------------------
        TRACK YOUR TRAIN IN REAL-TIME
    [ Enter Train Number or Name              ]
                 [ SEARCH TRAIN ]
--------------------- POPULAR TRAINS --------------------------
[ 12301 Rajdhani Exp ]   [ 12951 Mumbai Raj ]   [ 22691 BLR Raj ]
       [Track Now]             [Track Now]            [Track Now]
---------------------------------------------------------------
Key Elements:
    • Top navigation bar
    • Prominent search section
    • Popular train quick-access cards
    • Clean Tailwind CSS-based layout

9.2.2 Train Tracker Page Wireframe
-------------------------------------------------------------------
[Logo] Train: 12301 Rajdhani Express      [Share] [Save]
-------------------------------------------------------------------
| JOURNEY PROGRESS           | LIVE MAP                        |
|---------------------------|--------------------------------|
| ● NDLS ✓ Departed 16:25   |         🚆 Train Location      |
| ● MTJ ✓ Arrived 18:30     |                                |
| ◉ AGC ← NOW               |                                |
| STATUS: On Time           | Speed: 120 km/h                |
| Last Updated: 2 min ago   |                                |
| ○ GWL Expected 21:10      |                                |
| ○ BPL Expected 23:45      |                                |
|---------------------------|--------------------------------|
| ⚠ NETWORK ALERT                                          |
| Low connectivity zone ahead in 15 minutes                |
| [ Cache Data Now ]                                       |
-------------------------------------------------------------------
Key Features:
    • Split-screen layout (Journey Progress + Live Map)
    • Real-time location updates
    • Delay and speed information
    • Network alert banner with caching option

10. SECURITY ARCHITECTURE
Security is implemented at multiple layers to protect user data and ensure safe operation.

10.1 Django Built-in Security Features
    • CSRF Protection – Prevents Cross-Site Request Forgery attacks
    • XSS Protection – Automatic HTML escaping
    • SQL Injection Prevention – Django ORM parameterized queries
    • Clickjacking Protection – X-Frame-Options header

10.2 Authentication System (Optional Features)
    • Django Authentication Framework
    • Secure password hashing using PBKDF2
    • Session-based authentication
    • Optional “Remember Me” functionality

10.3 Data Validation
    • Form validation at view level
    • Model field constraints
    • Input sanitization
    • Server-side validation before database operations

10.4 HTTPS Security (Production)
    • SSL/TLS encryption
    • Secure cookies
    • HTTP Strict Transport Security (HSTS)
    • Secure reverse proxy via Nginx

11. REQUIREMENTS TRACEABILITY
This section maps functional requirements to system components.
Req ID
Requirement
Component
Status
REQ-001
Display live train location
TrainTrackerView
Planned
REQ-002
Show station-wise schedule
ScheduleView
Planned
REQ-003
Calculate ETA for stations
TrainTrackerView
Planned
REQ-004
Alert for low network zones
NetworkAlertView
Planned
REQ-005
Cache data for offline access
Service Worker
Planned
REQ-006
Display train on map
Leaflet.js + map.js
Planned
REQ-007
Search trains by number/name
HomeView
Planned
REQ-008
Show delay status
TrainStatus Model
Planned
REQ-009
Responsive mobile design
Tailwind CSS
Planned
REQ-010
Station detail information
StationDetailView
Planned

12. EXTERNAL API INTEGRATION & LIVE DATA SIMULATION ARCHITECTURE
This section explains how external APIs, estimation logic, caching, offline backup, and voice assistant integration work within the Train system.

12.1 External API Workflow (RapidAPI Integration)
The system integrates with an external train data provider via RapidAPI.
API Flow Architecture
RapidAPI
    ↓
fetch_external_train_status()
    ↓
normalize_train_data()
    ↓
Existing Cache + Timeline Logic
    ↓
FINAL API RESPONSE (Unchanged Contract)
Flow Explanation
    1. RapidAPI provides raw external train data.
    2. fetch_external_train_status() retrieves real-time train status.
    3. normalize_train_data() converts external data into the internal system format.
    4. The system merges:
        ◦ Cached data
        ◦ Timeline simulation logic
    5. The final API response is returned without changing the frontend contract.
This ensures:
    • Clean separation of concerns
    • Stable frontend APIs
    • Easy provider replacement in future

12.2 Core Idea: Heuristic-Based Network Prediction
Since real-time telecom network data is not available, the system uses heuristic modeling.
Key Assumption
Long distance between stations = Higher probability of low network connectivity
Why This Approach?
    • Logical and explainable
    • Interview-safe (defensible design decision)
    • Based on probabilistic inference
    • Used in real-world distributed systems
This allows the system to predict low-network zones even without telecom integration.

12.3 Estimated Time of Arrival (ETA) Calculation
To estimate arrival time between stations, we use the standard physics formula:
Time = Distance / Speed
Or
ETA = Current_Time + (Distance_Remaining / Average_Speed)
This enables:
    • Station-wise ETA calculation
    • Time-to-network-zone estimation
    • Offline prediction simulation

12.4 Live Train Movement Simulation (Interpolation Logic)
Problem
Train data updates may jump like:
Station A  →  Station B
What Users Expect
A → • → • → • → B
Solution: Interpolation
We simulate intermediate positions between two stations using:
    • Distance segmentation
    • Speed estimation
    • Time-based position updates
Interpolation Formula
Current_Position = 
Start_Location + (Speed × Time_Elapsed)
This creates:
    • Smooth live map animation
    • Realistic train movement
    • Continuous UI updates
    • Better user experience

12.5 High-Concurrency Handling (1000+ Users)
To handle large traffic (e.g., 1000 users requesting same train API):
Strategy: Intelligent Caching
cache = getattr(train, "cache", None)
if cache and not is_cache_stale(cache.last_updated):
    return Response(
        build_train_response(
            train=train,
            current_station=cache.current_station_name,
            next_station=next_stop.station.name if next_stop else None,
            distance_remaining=distance_remaining,
            timeline=cache.journey_time,
            cached=True,
        ),
        status=200
    )
Benefits:
    • Prevents repeated external API calls
    • Reduces server load
    • Handles burst traffic
    • Ensures response under 2 seconds
    • Supports 1000+ concurrent users

12.6 Offline Backup Architecture
Core Logic
When the system detects potential data loss (approaching low network zone):
It stores necessary data in advance.
Workflow
Network Alert API
        ↓
Time-to-Zone < Threshold?
        ↓
Pre-cache Trigger = TRUE
        ↓
Offline Package API
Offline Package Contains:
    • Current train location
    • Next 5 stations
    • Delay status
    • Estimated exit time from zone
    • 45-minute valid prediction model
Offline Prediction Validity
The prediction engine simulates movement and remains accurate for:
Up to 45 minutes
This ensures:
    • No UI freeze
    • No blank screen
    • Continuity in weak network zones

12.7 Network Alert API Logic
    1. Calculate distance to low network zone.
    2. Estimate time-to-zone using ETA formula.
    3. If time-to-zone < threshold:
        ◦ Trigger alert banner
        ◦ Activate offline pre-cache
    4. Switch to Service Worker when offline detected.

12.8 Voice Assistant (Inbuilt)
The system supports speech-based train search using Speech-to-Text.
Step 1: Speech Input
User speaks:
“Find train 12175”
Step 2: Text Processing API
Request
{
  "text": "Find train 12175"
}
Response
{
  "success": true,
  "language": "en",
  "intent": "TRAIN_BY_NUMBER",
  "autofill": {
      "train_number": "12175"
  },
  "action_api": "/api/train/12175/"
}
How It Works
    1. Convert speech → text
    2. Detect language
    3. Extract intent (NLP logic)
    4. Autofill train number
    5. Automatically call action API
Benefits
    • Hands-free interaction
    • Accessibility support
    • Faster search experience
    • Future-ready AI integration

12.9 System Strength Summary
This architecture provides:
    • Real-time train simulation
    • Heuristic-based network prediction
    • 1000+ user scalability via caching
    • Offline backup with 45-minute validity
    • Smooth interpolation for live movement
    • Voice-enabled smart search
    • Stable external API integration



END OF DOCUMENT

Document Revision History
Version
Roll No.
Author
Changes
1.0

Pratap Narayan Choubey & Arushi Goswami
Initial document creation




