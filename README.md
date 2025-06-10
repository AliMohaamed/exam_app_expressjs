# Exam System Backend

[![Node.js Version](https://img.shields.io/badge/node-v22.14.0-blue)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-green)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.14.3-green)](https://www.mongodb.com/)

A robust and feature-rich examination management system built with Node.js and Express. This system provides a comprehensive solution for educational institutions to manage exams, questions, and student assessments with advanced features like AI-powered question generation and automated scheduling.

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Project Structure](#-architecture--project-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Usage Examples](#-usage-examples)
- [Configuration](#-configuration)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License & Credits](#-license--credits)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)

## Features

### Admin Features

- **User Management**

  - Create and manage user accounts
  - Assign roles and permissions
  - View user activity logs
  - Manage user access and restrictions

- **Exam Management**

  - Create and schedule exams
  - Set exam duration and passing criteria
  - Configure exam settings and restrictions
  - Support for different exam types
  - Bulk exam creation and management
  - Exam analytics and reporting

- **Question Management**
  - Create and manage questions
  - Support for multiple question types
  - Question categorization and tagging
  - Question bank management
  - Question difficulty levels
  - Question validation and review

- **Exam Creation**

  - Create custom exams
  - Set time limits and passing scores
  - Configure question randomization
  - Set up exam schedules
  - Preview exam interface

- **Student Management**
  - View student progress
  - Track exam attempts
  - Generate performance reports
  - Manage student access to exams

### Student Features

- **Exam Taking**

  - Secure exam interface
  - Real-time progress tracking
  - Auto-save functionality
  - Timer display
  - Question navigation
  - Submit exam functionality

- **Results & Analytics**
  - View exam results
  - Performance analytics
  - Historical performance tracking
  - Download certificates
  - View detailed feedback

### System Features

- **Authentication & Security**

  - JWT-based authentication
  - Role-based access control
  - Password encryption
  - Session management
  - Rate limiting

- **Advanced Features**
  - AI-powered question generation
  - Automated scheduling system
  - Email notifications
  - Excel report generation
  - API documentation with Swagger
  - Real-time updates
  - Data backup and recovery

## 🛠 Technology Stack

### Backend

- **Runtime:** Node.js v22.14.0
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB v8.14.3 with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **API Documentation:** Swagger/OpenAPI

### Core Dependencies

- **Security:**

  - bcryptjs v3.0.2 (Password hashing)
  - jsonwebtoken v9.0.2 (JWT authentication)
  - cors v2.8.5 (Cross-origin resource sharing)

- **Data Processing:**

  - exceljs v4.4.0 (Excel report generation)
  - date-fns v4.1.0 (Date manipulation)
  - randomstring v1.3.1 (Random string generation)

- **Communication:**

  - nodemailer v7.0.3 (Email notifications)

- **Development:**

  - nodemon v3.1.10 (Development server)
  - morgan v1.10.0 (HTTP request logging)
  - compression v1.8.0 (Response compression)

- **Validation:**
  - joi v17.13.3 (Request validation)

## 🏗 Architecture & Project Structure

### Project Structure

```
exam_system_backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── exam/         # Exam management
│   │   ├── question/     # Question management
│   │   ├── students/     # Student management
│   │   └── attempt/      # Exam attempts
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── utils/           # Utility functions
│   └── docs/            # API documentation
├── DB/                  # Database related files
├── index.js            # Application entry point
├── package.json        # Project dependencies
└── vercel.json         # Deployment configuration
```

### Architecture Patterns

- **MVC Pattern:** Separation of concerns between models, views, and controllers
- **Middleware Pattern:** Request processing pipeline
- **Service Layer:** Business logic abstraction
- **Repository Pattern:** Data access abstraction

## 🚀 Installation & Setup

### Prerequisites

- Node.js v22.14.0 or higher
- MongoDB v8.14.3 or higher
- npm or yarn package manager
- Git

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/AliMohaamed/exam_app_expressjs
   cd exam_system_backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string

   # JWT Configuration
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d

   # Email Configuration
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password

   # AI Configuration (if applicable)
   AI_API_KEY=your_ai_api_key
   ```

4. Initialize the database:
   ```bash
   node seedingData.js
   ```

### Running the Application

- Development mode:

  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

## 📚 API Documentation

The API documentation is available through Swagger UI when the application is running:

```
http://localhost:3000/api-docs
```


## 🔒 Security Features

### Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Token refresh mechanism
- Session management

### Authorization

- Role-based access control
- Permission-based authorization
- API endpoint protection
- Rate limiting

### Data Protection

- Input validation
- Data sanitization
- XSS protection
- CSRF protection
- SQL injection prevention

## 🚢 Deployment

### Production Deployment

1. Set environment variables
2. Build the application
3. Start the server

### Performance Optimization

- Enable compression
- Use caching
- Optimize database queries
- Implement rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines

- Follow ESLint configuration
- Use meaningful variable names
- Write clear comments
- Follow the existing code structure

## 📄 License & Credits

This project is licensed under the ISC License.

### Acknowledgments

- [List of contributors]
- [List of resources used]

## 🔧 Troubleshooting

### Common Issues

1. Database Connection Issues

   - Check MongoDB connection string
   - Verify MongoDB service is running

2. Authentication Issues

   - Verify JWT secret
   - Check token expiration

3. Email Service Issues
   - Verify email credentials
   - Check email service configuration

## 🗺 Roadmap

### Planned Features

- [ ] Real-time exam monitoring
- [ ] Advanced analytics dashboard
- [ ] Add Teacher Role
- [ ] Mobile application
- [ ] Integration with LMS systems
- [ ] Enhanced AI question generation

### Known Issues

- [List of known issues]

---

For more information, please contact alimohamed11907@gmail.com
