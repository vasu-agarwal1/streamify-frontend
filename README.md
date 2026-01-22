# 📽️ Streamify

![Status](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> **A production-grade video streaming architecture engineered for scalability, performance, and cross-platform security.**

---

## 🚀 Live Demo
**[🔗 Click here to visit Streamify Live](https://streamify-frontend-vasu.vercel.app)** *(Host on Vercel & Render)*

---

## 🧐 The Problem
Building a video platform requires more than just storing files. The core challenge is efficiently managing **complex relational data** (views, subscriptions, nested comments) in a NoSQL environment without creating performance bottlenecks. Additionally, securing authentication between a decoupled Frontend (Vercel) and Backend (Render) presents significant **Cross-Origin Resource Sharing (CORS)** and cookie security challenges.

**Streamify solves this by:**
1.  Using advanced **MongoDB Aggregation Pipelines** to compute complex analytics (Dashboard stats) in single database queries.
2.  Implementing a robust **JWT-based Soft Authentication** system that handles secure cross-site cookies.
3.  Optimizing performance with **Infinite Scroll (Intersection Observer)** and URL-driven state management.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
* ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js&logoColor=white) **Next.js 15 (App Router)** - Server Side Rendering & Routing.
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) **TypeScript** - Strict static typing for reliability.
* ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) **Tailwind CSS + ShadCN UI** - Responsive & accessible design.
* ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) **Redux Toolkit** - Global state management (Auth).
* **React Hook Form** - Client-side form validation.

### **Backend (Server)**
* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) **Node.js & Express** - RESTful API architecture.
* ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) **MongoDB (Mongoose)** - Data modeling & Aggregation pipelines.
* ![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white) **JWT** - Secure Access & Refresh token rotation.
* ![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white) **Cloudinary** - Video & Image CDN storage.

---

## 🌟 Key Engineering Highlights

### 1. Complex Data Aggregation
Instead of multiple API calls, I utilized MongoDB **Aggregation Pipelines** (`$lookup`, `$addFields`, `$project`) to fetch video details, creator stats, and subscription status in a single efficient query.

### 2. Cross-Origin Security (CORS)
Since the Client and Server are deployed on different domains (`vercel.app` vs `onrender.com`), I engineered a secure cookie policy using `SameSite: 'None'`, `Secure: true`, and proxy trust configuration to ensure persistent sessions across domains.

### 3. Performance Optimizations
* **Infinite Scroll:** Implemented `IntersectionObserver` to lazy-load videos, reducing initial page payload.
* **Debounced Search:** URL-driven search architecture allowing shareable links and deep-linking support without client-side state bloat.

---

## 📸 Screenshots

| Home Page (Infinite Scroll) | Video Player & Comments |
|:---:|:---:|
| ![Home](https://github.com/user-attachments/assets/placeholder-home) | ![Player](https://github.com/user-attachments/assets/placeholder-player) |

| Dashboard Analytics | Responsive Search |
|:---:|:---:|
| ![Dashboard](https://github.com/user-attachments/assets/placeholder-dashboard) | ![Search](https://github.com/user-attachments/assets/placeholder-search) |

---

## 💻 How to Run Locally

Follow these steps to set up the project on your machine.

### Prerequisites
* Node.js (v18+)
* MongoDB Local or Atlas URI
* Cloudinary Account

### 1. Clone the Repo
```bash
git clone [https://github.com/your-username/streamify.git](https://github.com/your-username/streamify.git)
cd streamify
