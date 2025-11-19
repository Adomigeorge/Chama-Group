# ChamaPro - Group Financial Management Platform
## 📋 Project Overview
ChamaPro is a comprehensive web application designed to help community savings groups (Chamas) manage their finances, members, contributions, and loans efficiently. The platform provides a transparent and organized system for group financial management.

## 🎯 Key Features
### Group & Member Management
Create Multiple Groups: Users can create and manage multiple savings groups

Smart Member Invitations: Invite members with 7-day expiry system

Role-based Access: Admin and member roles with different permissions

Real-time Member Tracking: View active, pending, and expired invitations

### Financial Management
Contribution Tracking: Record and monitor member contributions

Loan Management: Track loans, repayments, and interest calculations

Financial Dashboard: Real-time overview of group finances

Savings Progress: Visual tracking of group savings goals

### Security & Automation
Automatic Cleanup: Expired invitations are automatically removed after 7 days

Secure Authentication: JWT-based login system

Email Notifications: Automated invitation emails with expiry information

Data Protection: Secure database with proper access controls

## 🏗️ System Architecture
### Frontend (React + Vite)
Modern React with hooks and functional components

Responsive Design works on desktop and mobile

React Router for seamless navigation

Real-time Updates for member status changes

Clean UI/UX with intuitive group management

### Backend (Node.js + Express + PostgreSQL)
RESTful API with proper HTTP status codes

PostgreSQL Database with Sequelize ORM

Automated Services for email and data cleanup

Middleware Protection for secure routes

Error Handling with meaningful responses

### 🔄 Workflow & User Journey
For Group Admins
Create Group → Set contribution amounts and meeting frequency

Invite Members → Send email invitations with 7-day expiry

Track Progress → Monitor contributions and member status

Manage Finances → Oversee loans and group savings

For Members
Receive Invitation → Get email with secure acceptance link

Join Group → Accept invitation within 7 days

Make Contributions → Regular savings contributions

Access Features → View group progress and personal stats

### ⚙️ Technical Features
Smart Invitation System
7-Day Expiry: Invitations automatically expire after one week

Automatic Cleanup: Hourly service removes expired records

Manual Testing: API endpoint for immediate cleanup testing

Status Tracking: Real-time updates on invitation status

### Database Design
Users Table: User accounts and authentication

Groups Table: Group information and settings

Members Table: Membership records with status and expiry

Contributions Table: Financial transaction records

Loans Table: Loan applications and repayments

### Security Implementation
Password Hashing: Secure bcrypt encryption

JWT Tokens: Stateless authentication

Protected Routes: Middleware for API security

Input Validation: Server-side data validation

## 🚀 Getting Started
Prerequisites Required
Node.js runtime environment

PostgreSQL database server

SMTP email service (Gmail, etc.)

Installation Steps
Backend Setup: Configure environment variables and database

Frontend Setup: Install dependencies and development server

Database Setup: Create tables and initial data structure

Email Configuration: Set up SMTP for invitation emails

### Development Servers
Backend API: Runs on port 5000

Frontend App: Runs on port 5173

Database: PostgreSQL on standard port

## 📊 API Endpoints
### Authentication
User registration and login

Token verification

Protected route access

### Group Management
Create and view groups

Group details and settings

Member list management

Member Operations
Send invitations with expiry

Accept group invitations

Member status updates

System Maintenance
Automatic invitation cleanup

Manual cleanup for testing

Health monitoring

### 🔧 System Services
Email Service
Sends invitation emails with expiry information

Professional HTML email templates

Error handling for delivery failures

Cleanup Service
Automated hourly expired invitation removal

Manual trigger for testing purposes

Logging for monitoring and debugging

Database Service
Secure data access patterns

Relationship management between entities

Migration and seeding capabilities

### 🎨 User Experience
Dashboard Features
Group overview with key statistics

Member list with status indicators

Financial summary and progress tracking

Quick actions for common tasks

Member Interface
Clean invitation acceptance flow

Contribution history viewing

Group activity timeline

Personal financial overview

Admin Controls
Member management tools

Financial reporting

Group settings configuration

Invitation management

## 🔒 Security & Privacy
Data Protection
Secure password storage

Encrypted communication

Database access controls

Regular security updates

Access Control
Role-based permissions

Session management

API endpoint protection

Input sanitization

## 📈 Future Enhancements
Planned Features
Mobile application development

Advanced financial reporting

Integration with payment gateways

Multi-language support

Advanced notification system

Scalability Improvements
Database optimization for large groups

Caching implementation

Load balancing setup

Microservices architecture

## 🤝 Support & Community
Documentation
Comprehensive API documentation

User guides for different roles

Troubleshooting common issues

Deployment guides

Contribution
Open for feature suggestions

Bug reporting system

Community feedback integration

Regular updates and improvements

ChamaPro - Transforming traditional savings groups into modern, efficient financial communities through technology and transparency.

