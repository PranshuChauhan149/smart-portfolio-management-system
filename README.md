🚀 Smart Portfolio Management System

A modern full-stack FinTech Portfolio Management Platform built using Laravel, React.js, SQLite, Tailwind CSS, and Framer Motion.

This platform helps investors track investments, analyze portfolio performance, monitor profits/losses, evaluate risks, and manage assets through a premium SaaS-style dashboard with beautiful animations and responsive UI.

✨ Features
🔐 Authentication System
User Registration
Secure Login/Logout
Forgot Password
Email Verification
Role-Based Access (Admin/User)
📊 Dashboard Analytics
Total Investment Tracking
Portfolio Value Overview
Profit/Loss Analytics
Risk Score Analysis
Interactive Charts & Graphs
Market Insights
💼 Portfolio Management
Add Investments
Edit Investments
Delete Investments
Asset Tracking
ROI Calculation
Investment History
📈 Market Trends
Live Crypto Prices
Stock Market Trends
Top Gainers/Losers
Financial Insights
⚠️ Risk Analysis
Portfolio Risk Score
Diversification Analysis
Smart Recommendations
High/Medium/Low Risk Detection
🔔 Notifications System
Real-Time Alerts
Profit Notifications
Risk Warnings
Activity Updates
🛠️ Admin Panel
User Management
Investor Approval
Dashboard Analytics
Reports & Monitoring
🧑‍💻 Tech Stack
Frontend
React.js
Vite
Tailwind CSS
Framer Motion
Lucide React
Recharts
Axios
Backend
Laravel 12
Laravel Sanctum
SQLite
REST APIs
🎨 UI/UX Design

Inspired by:

Stripe
Linear
Vercel
Framer
Apple

Design Features:

Glassmorphism UI
Aurora Gradients
Responsive Layouts
Smooth Animations
Modern Dashboard
Dark Mode Design
Premium SaaS Experience
📂 Project Structure
smart-portfolio-management-system/
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── config/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   └── assets/
│
└── README.md
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/PranshuChauhan149/smart-portfolio-management-system.git
🔥 Backend Setup (Laravel)
Navigate to backend
cd backend
Install dependencies
composer install
Create environment file
cp .env.example .env
Generate application key
php artisan key:generate
Configure SQLite Database

Create SQLite database:

touch database/database.sqlite

Update .env

DB_CONNECTION=sqlite
Run migrations
php artisan migrate
Start backend server
php artisan serve
⚡ Frontend Setup (React)
Navigate to frontend
cd frontend
Install dependencies
npm install
Start development server
npm run dev
📊 Financial Calculations
Current Value
Current Value = Quantity × Current Price
Profit/Loss
Profit/Loss = (Current Price - Buy Price) × Quantity
ROI
ROI = Profit / Investment × 100
📱 Responsive Design

Fully optimized for:

Mobile
Tablet
Desktop
🔐 Security Features
CSRF Protection
Password Hashing
Sanctum Authentication
Protected Routes
Middleware Authorization
📸 Screenshots
Dashboard Preview
Modern analytics dashboard
Interactive charts
Portfolio overview
Responsive UI
🚀 Future Enhancements
AI Investment Recommendations
Real-Time Stock APIs
Multi-Currency Support
Dark/Light Theme Toggle
Advanced Analytics
Mobile App Version
👨‍💻 Author
Pranshu Chauhan

GitHub:
https://github.com/PranshuChauhan149

⭐ Support

If you like this project, give it a ⭐ on GitHub!

📄 License

This project is licensed under the MIT License.
