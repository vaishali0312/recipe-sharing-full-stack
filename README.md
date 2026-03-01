🍲 Recipe Sharing Platform

A full-stack web application that allows users to discover, share, and manage recipes in one place. Users can register, log in, create recipes, and explore dishes shared by others.

🔗 Live Demo

🌐 Frontend: https://vaishurecipe.netlify.app

⚙️ Backend API: https://recipe-sharing-full-stack.onrender.com

🚀 Features
👤 Authentication

User registration & login

Secure authentication system

Persistent login session

🍳 Recipe Management

Create new recipes

View all recipes

Add ingredients & instructions

Upload recipe images

⭐ User Experience

Clean and responsive UI

Category-based organization

Smooth navigation with React Router

🛠️ Tech Stack
Frontend

React.js

Vite

Tailwind CSS

Axios

React Router

Backend

Node.js

Express.js

PostgreSQL

CORS & dotenv

Deployment

Frontend: Netlify

Backend: Render

📂 Project Structure
recipe-sharing-full-stack/
│
├── frontend/          # React frontend
│   ├── src/
│   └── dist/
│
├── backend/           # Node & Express API
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/vaishali0312/recipe-sharing-full-stack.git
cd recipe-sharing-full-stack
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
DATABASE_URL=your_database_url

Run backend:

npm start
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🌍 Environment Variables
Backend (.env)
PORT=5000
DATABASE_URL=
JWT_SECRET=
Frontend

Update API base URL:

VITE_API_URL=https://recipe-sharing-full-stack.onrender.com
📡 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/users/register	Register user
POST	/users/login	Login user
Recipe Routes
Method	Endpoint	Description
GET	/recipes	Get all recipes
POST	/recipes	Create recipe
🚀 Deployment Guide
Backend (Render)

Root directory: backend

Build command: npm install

Start command: npm start

Frontend (Netlify)

Base directory: frontend

Build command: npm run build

Publish directory: dist

🐞 Common Issues & Fixes

✔ Route not found on Netlify
→ Add _redirects file inside frontend/public:

/* /index.html 200

✔ CORS errors
→ Enable CORS in backend:

app.use(cors());

✔ API not working after deploy
→ Ensure frontend API URL points to Render backend.

📌 Future Improvements

⭐ Recipe ratings & reviews

❤️ Favorites & bookmarks

🔍 Search & filters

📱 Mobile optimization

🔐 JWT authentication

👩‍💻 Author

Vaishali Shenisetti

GitHub: https://github.com/vaishali0312

📜 License

This project is built for educational purposes and learning full-stack development.
