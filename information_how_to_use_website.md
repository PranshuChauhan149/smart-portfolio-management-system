# Smart Portfolio Management System - User Guide

Welcome to the **Smart Portfolio Management System**! This document provides a comprehensive guide on how to navigate and utilize every page of the application, designed with a premium glassmorphism UI.

## Table of Contents
1. [Public Pages](#1-public-pages)
2. [Authentication](#2-authentication)
3. [Investor Dashboard (User Role)](#3-investor-dashboard-user-role)
4. [Admin Panel (Admin Role)](#4-admin-panel-admin-role)

---

## 1. Public Pages

### Home / Landing Page (`/`)
- **Purpose**: The front face of the platform explaining core features.
- **How to Use**: Scroll through the beautifully designed sections detailing the platform's benefits, features, and testimonials. Use the call-to-action buttons to either **Login** or **Get Started** (Register).

### About Page (`/about`)
- **Purpose**: Provides background information on the platform's mission and the team.
- **How to Use**: Read about the vision behind the Smart Portfolio platform.

### Contact Page (`/contact`)
- **Purpose**: Allows users to reach out to the support team or administrators.
- **How to Use**: Fill out your name, email, subject, and message. This sends a direct message to the Admin Panel where administrators can view and respond to your inquiry.

---

## 2. Authentication

### Login (`/login`)
- **Purpose**: Access your secure account.
- **How to Use**: Enter your registered email and password. Based on your account type, you will be redirected to either the **Investor Dashboard** or the **Admin Panel**.

### Register (`/register`)
- **Purpose**: Create a new investor account.
- **How to Use**: Provide your name, email, and password to create an account. You will automatically be logged in and directed to your new dashboard.

---

## 3. Investor Dashboard (User Role)

Once logged in as a standard user (Investor), you have access to a suite of powerful portfolio tracking tools.

### Main Dashboard (`/dashboard`)
- **Purpose**: A high-level overview of your entire financial standing.
- **How to Use**: 
  - View total investment value, current value, total profit/loss, and overall ROI at a glance.
  - Review your top performing assets and a snapshot of your asset distribution via interactive charts.

### Portfolio Manager (`/portfolio`)
- **Purpose**: Manage individual asset holdings.
- **How to Use**:
  - Click **Add Investment** to input new assets (Stocks, Crypto, Gold, Bonds, etc.) with purchase price, date, and quantity.
  - View your existing assets in the table. 
  - Use the action buttons to **Edit** (update prices/notes) or **Remove** (sell) an asset.

### Analytics (`/analytics`)
- **Purpose**: Deep-dive visual insights into your portfolio.
- **How to Use**: Review performance charts (e.g., bar charts of asset performance) and historical growth data. This is where you analyze long-term trends.

### Risk Analysis (`/risk`)
- **Purpose**: Evaluates how safe or volatile your investments are.
- **How to Use**: Check your **Risk Score** (0-100) and review AI-generated advice based on your asset allocation (e.g., if you hold too much high-risk crypto, it may suggest rebalancing into bonds).

### Market Trends (`/market`)
- **Purpose**: Shows current market conditions.
- **How to Use**: Browse general market indicators and news. (Currently displays simulated trending data).

### Notifications (`/notifications`)
- **Purpose**: Stay updated on account alerts and system broadcasts.
- **How to Use**: View messages sent by the admin or automated system alerts (e.g., "Account status updated" or "Price dropped"). Click "Mark all as read" to clear unread badges.

### Reports (`/reports`)
- **Purpose**: Exportable summaries of your activity.
- **How to Use**: Generate and view detailed logs of your transactions and portfolio snapshots.

### Profile (`/profile`)
- **Purpose**: Manage personal settings.
- **How to Use**: Update your name, contact information, and risk preferences.

---

## 4. Admin Panel (Admin Role)

If you log in with an Administrator account (e.g., `admin@smartportfolio.com`), you see a completely different set of pages for managing the platform.

### Admin Dashboard (`/admin`)
- **Purpose**: Platform-wide statistics.
- **How to Use**: View global metrics such as Total Users, Total Platform Value, Global Asset Distribution (pie charts), and a feed of recent global transactions.

### Manage Users (`/admin/users`)
- **Purpose**: Control access and monitor investors.
- **How to Use**: 
  - View a paginated list of all registered users.
  - See how many portfolios each user has.
  - Change user statuses (Active, Pending, Suspended) or delete problematic accounts.

### Platform Analytics (`/admin/analytics`)
- **Purpose**: Track the business metrics of the platform itself.
- **How to Use**: 
  - Analyze **User Growth** month-over-month.
  - View **Top Investors** (users with the highest portfolio counts and values).
  - Understand the macro distribution of assets across the entire user base.

### Messages (`/admin/messages`)
- **Purpose**: Handle customer support inquiries.
- **How to Use**: View all messages submitted via the public Contact page. You can read, reply to, and delete these messages.
