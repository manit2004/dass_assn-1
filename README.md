# DASS Assignment 1

## E-Commerce Buy-Sell-Rent Web Application

This project is a full-stack e-commerce web application developed as part of the Design and Analysis of Software Systems (DASS) course assignment. This platform is designed specifically for buying, selling, and renting items.

## Project Overview

The application allows users to:
- Register and authenticate using either email/password or institutional CAS system
- Browse items for purchase or rent
- List items for sale or rent
- Place and track orders
- Chat with customer support using an AI-powered chatbot
- Complete checkout process

## Tech Stack

### Frontend
- React.js with modern hooks and functional components
- Bootstrap for responsive UI
- Google reCAPTCHA for secure authentication

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- CAS integration for institutional login

### Chatbot
- Python-based AI chatbot integration
- OpenAI API for natural language processing

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB account

### Environment Variables

**IMPORTANT**: There are two separate `.env` files in this project:

1. **Root directory `.env`** - Contains application configuration:
```
MONGODB_URL="your-mongodb-connection-string"
JWT_SECRET="your-secure-jwt-secret"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
SESSION_SECRET="your-session-secret"
REACT_APP_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
```

2. **Backend directory `.env`** - Contains only the OpenAI API key:
```
OPENAI_API_KEY="your-openai-api-key"
```

### Installation

1. Clone the repository
```
git clone <repository-url>
```

2. Install Node dependencies
```
npm install
```

3. Install Python dependencies for chatbot
```
pip install -r backend/requirements.txt
```

4. Start backend development server
```
npm run dev
```

5. Start the Python chatbot service
```
cd backend
python chatbot.py
```

6. Open a new terminal and start frontend
```
cd frontend
npm install
npm start
```

## Features

- **Authentication**: Email/password login with reCAPTCHA protection and CAS SSO integration
- **User Management**: Registration, profile updates
- **Item Browsing**: View available products for purchase or rent
- **Item Listing**: Sellers can list items for sale or rent
- **Order Management**: Place and track orders
- **Customer Support**: AI-powered chatbot for assistance

## Security Measures

- JWT-based authentication
- Password hashing with bcrypt
- reCAPTCHA protection against bots
- Secure environment variables management
- Input validation and sanitization

## Project Structure

```
dass_assn_1/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── item.model.js
│   │   ├── order.model.js
│   │   └── user.model.js
│   ├── chatbot.py
│   ├── requirements.txt
│   ├── server.js
│   └── .env  # Contains only OPENAI_API_KEY
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CasTest.js
│   │   │   ├── chatbot.js
│   │   │   ├── confirm_order.js
│   │   │   └── ...
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
├── .gitignore
├── package.json
├── README.md
└── .env  # Contains all other configuration variables
```

## Running the Application

1. Start MongoDB service
2. Run the Node.js backend (`npm run dev`)
3. Run the Python chatbot service (`python backend/chatbot.py`)
   - Requires Flask, OpenAI, python-dotenv, and flask-cors packages
   - Runs on port 5001
   - Needs valid OpenAI API key in backend/.env
4. Run the React frontend (`cd frontend && npm start`)

## Notes

This project was developed as an assignment for the DASS course at IIIT Hyderabad, implementing a multi-tier architecture with separate frontend, backend, and AI-powered chatbot components. The chatbot feature requires running both the Node.js server and the Python script simultaneously.

**Important**: Please read the assignment carefully. This application is specifically designed as a buy-sell-rent marketplace platform.
