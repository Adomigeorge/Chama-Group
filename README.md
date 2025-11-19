#ChamaPro - Group Financial Management Platform

#A comprehensive web application for managing group finances, contributions, loans, and member interactions for Chamas (community savings groups).

#🚀 Features
#Core Functionality
Group Management: Create and manage multiple savings groups
Member Management: Invite members with expiry-based invitations
Contribution Tracking: Record and monitor member contributions
Loan Management: Track loans and repayments within groups
Real-time Dashboard: View group statistics and financial overview

#Security & Authentication
JWT-based authentication system
Protected routes and API endpoints
Secure password hashing
Role-based access control

#Member Invitation System
7-day expiry for pending invitations
Automatic cleanup of expired invitations
Email notifications with secure acceptance links
Real-time status updates for group admins

#🛠️ Tech Stack
#Frontend
React 18 with modern hooks
React Router for navigation
Vite for fast development builds
CSS3 with responsive design
Lucide React for icons

#Backend
Node.js with Express.js
PostgreSQL with Sequelize ORM
JWT for authentication
Nodemailer for email services
CORS enabled for cross-origin requests

#Key Packages
express - Web server framework
sequelize - PostgreSQL ORM
bcryptjs - Password hashing
jsonwebtoken - Authentication tokens
nodemailer - Email service
cors - Cross-origin resource sharing
dotenv - Environment variables

#📚 API Documentation
Authentication Endpoints
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/verify - Verify token

Group Endpoints
GET /api/groups - Get user's groups
POST /api/groups - Create new group
GET /api/groups/:id - Get group details
GET /api/groups/:id/members - Get group members

Member Endpoints
POST /api/groups/:groupId/members - Invite member to group
POST /api/groups/:groupId/accept - Accept group invitation
DELETE /api/cleanup-expired - Manual cleanup of expired invitations

#🔧 Key Features Explained
Smart Invitation System
Invitations expire after 7 days automatically
Automatic cleanup service runs hourly
Manual cleanup endpoint for testing
Email notifications with expiry information

Database Models
Users: User accounts and authentication
Groups: Chama groups with financial settings
Members: Group membership with roles and status
Contributions: Member contribution records
Loans: Loan applications and repayments

Security Features
Password hashing with bcrypt
JWT token-based authentication
Protected API routes
Input validation and sanitization

#👥 Authors
Georges Adomi - Initial work - Adomigeorge

#🙏 Acknowledgments
Inspired by traditional Chama savings groups
Built for community financial empowerment
