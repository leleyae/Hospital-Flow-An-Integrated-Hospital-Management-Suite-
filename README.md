HospitalFlow: An Integrated Hospital Management Suite
🏥 Project Overview

HospitalFlow is a comprehensive, web-based hospital management system designed to streamline healthcare delivery by integrating all hospital departments into a cohesive digital ecosystem. The system replaces fragmented paper-based workflows with a centralized platform that enhances patient safety, reduces administrative burden, and improves operational efficiency.


Key Features
👥 Role-Based Modules

Module,Key Features
👨‍⚕️ Patient Portal,"Online appointment booking, Medical records access, Secure messaging, Bill payment"
🖥️ Reception,"Patient registration, Insurance verification, Visitor logging, Discharge processing"
🚨 Triage,"Vital signs recording, Emergency tagging (RED/YELLOW/GREEN), Critical symptom alerts"
🩺 Doctor,"Electronic Health Records (EHR), Diagnosis & prescriptions, Lab test ordering, OT scheduling"
🔬 Laboratory,"Digital test requests, Result entry & verification, Equipment logs, PDF reports"
💊 Pharmacy,"Prescription dispensing, Drug interaction checker, Inventory management, Expiry tracking"
👨‍💼 Admin,"Staff management, Bed occupancy monitoring, Financial analytics, System configuration"

Technology Stack
Frontend
React 18 with TypeScript

React Router v6 for navigation

Redux Toolkit for state management

Material-UI / Ant Design for UI components

Chart.js for data visualization

Axios for API communication

Backend
Node.js with Express.js

MongoDB with Mongoose ODM

JWT for authentication

Bcrypt.js for password hashing

Socket.io for real-time updates

Multer for file uploads

PDFKit for report generation

DevOps & Tools
Docker for containerization

Jest & React Testing Library for testing

GitHub Actions for CI/CD

ESLint & Prettier for code quality

Swagger for API documentation

📁 Project Structure
Plaintext
hospitalflow/
├── client/                # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── features/      # Feature-based modules
│       ├── pages/         # Page components
│       ├── services/      # API services
│       └── utils/         # Utility functions
├── server/                # Backend Express application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Helper functions
│   └── config/            # Configuration files
├── docs/                  # Documentation
└── docker-compose.yml     # Docker setup
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

MongoDB (v7 or higher)

npm or yarn

Git






Installation
Clone the repository

Bash
git clone https://github.com/leleyae/Hospital-Flow-An-Integrated-Hospital-Management-Suite-.git
cd hospitalflow
Install Dependencies

Bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
Environment Setup Create a .env file in the server directory and add your configurations:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Run the Application

Bash
# Start Backend (from /server)
npm run dev

# Start Frontend (from /client)
npm start
