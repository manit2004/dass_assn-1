# DASS Assignment 1

## E-Commerce Buy-Sell-Rent Web Application

This project is a full-stack e-commerce web application developed as part of the Design and Analysis of Software Systems (DASS) course assignment. This platform allows users to buy, sell, and rent items in a marketplace environment.

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

1. **Root directory `.env`** - Contains all configuration except OpenAI API key:**Root directory `.env`** - Contains all configuration except OpenAI API key:
```
MONGODB_URL="your-mongodb-connection-string"
JWT_SECRET="your-secure-jwt-secret"
RECAPTCHA_SECRET_KEY="your-recaptcha-secret-key"
SESSION_SECRET="your-session-secret"
``````

2. **Frontend directory `.env`** - Contains the OpenAI API key and reCAPTCHA site key:CHA site key:
```
REACT_APP_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"REACT_APP_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
OPENAI_API_KEY="your-openai-api-key"
```
### Installation
 Installation
1. Clone the repository
```Clone the repository
git clone <repository-url>```
```

2. Install Node dependencies
```Install Node dependencies
npm install```
```

3. Install Python dependencies for chatbot
```Install Python dependencies for chatbot
pip install -r backend/requirements.txt```
```.txt

4. Start backend development server
```Start backend development server
npm run dev```
```

5. Start the Python chatbot service
```on chatbot service
cd backend
python chatbot.pycd backend
```

6. Open a new terminal and start frontend
```ew terminal and start frontend
cd frontend
npm installfrontend
npm startnpm install
```
```
## Features

- **Authentication**: Email/password login with reCAPTCHA protection and CAS SSO integration
- **User Management**: Registration, profile updates reCAPTCHA protection and CAS SSO integration
- **Item Browsing**: View available products for purchase or rentpdates
- **Item Listing**: List items for sale or rent or rent
- **Order Management**: Place and track orders- **Item Listing**: List items for sale or rent
- **Customer Support**: AI-powered chatbot for assistance**: Place and track orders
- **Customer Support**: AI-powered chatbot for assistance
## Security Measures

- JWT-based authentication
- Password hashing with bcrypt
- reCAPTCHA protection against bots
- Secure environment variables management- reCAPTCHA protection against bots
- Input validation and sanitization variables management
- Input validation and sanitization
## Project Structure
tructure
```
dass_assn_1/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── item.model.js
│   │   ├── order.model.jsodel.js
│   │   └── user.model.jsjs
│   ├── chatbot.pymodel.js
│   ├── requirements.txtbot.py
│   ├── server.jsrements.txt
│   └── .envjs
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CasTest.js
│   │   │   ├── chatbot.jsTest.js
│   │   │   ├── confirm_order.jsatbot.js
│   │   │   └── ...rm_order.js
│   │   ├── App.js
│   │   ├── index.cssApp.js
│   │   └── index.jsdex.css
│   └── .envx.js
├── .gitignore
├── package.jsonignore
├── README.md package.json
└── .env├── README.md
```
```
## Running the Application

1. Start MongoDB service
2. Run the Node.js backend (`npm run dev`)
3. Run the Python chatbot service (`python backend/chatbot.py`)2. Run the Node.js backend (`npm run dev`)
4. Run the React frontend (`cd frontend && npm start`)he Python chatbot service (`python backend/chatbot.py`)
4. Run the React frontend (`cd frontend && npm start`)
## Notes
## Notes


This project was developed as an assignment for the DASS course at IIIT Hyderabad, implementing a multi-tier architecture with separate frontend, backend, and AI-powered chatbot components. The chatbot feature requires running both the Node.js server and the Python script simultaneously.
This project was developed as an assignment for the DASS course at IIIT Hyderabad, implementing a multi-tier architecture with separate frontend, backend, and AI-powered chatbot components. The chatbot feature requires running both the Node.js server and the Python script simultaneously.
