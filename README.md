# BUSTRAC- Development of school bus tracking and monitoring system

It is a school bus tracking and monitoring system developed as a Final Year Project. The system ensures student safety and transparency for parents and school administrators through real-time GPS tracking, live video footage and mobile communication

---

##  System Overview

The project is divided into **three main modules**:

| Module                 | Technology           | Description |
|------------------------|----------------------|-------------|
| **Backend API**        | Spring Boot + MongoDB | Core logic, authentication, route management, user roles, and data persistence |
| **Web Admin Dashboard**| React with Next JS | School admin dashboard for managing routes, buses, users, live footages, and tracking |
| **Mobile App**         | Flutter              | Interface for parents to view tracking info and communication platform |

---

## ⚙️ Features

### 🛠 Backend (Spring Boot)
- JWT-based authentication 
- MongoDB integration for flexible document storage
- REST APIs for managing users, buses, routes, students, live video footages, and location tracking
- Google OAuth2 

### 🖥 Admin Dashboard (Next JS)
- Add/update/delete users, routes, and buses
- Assign buses to routes and view real-time locations
- Broadcast announcements to parents
- Dashboard statistics (e.g. active routes, buses, check-ins)

### 📱 Mobile App (Flutter)
- Login for parents 
- Parents can view child's location
- Real-time location tracking using GPS data
- Parents can view a summary report



