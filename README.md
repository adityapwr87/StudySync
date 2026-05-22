# 🚀 CodeKeeper

> **A full-stack ecosystem and Chrome Extension for extracting, organizing, and collaborating on competitive coding problems.**

CodeKeeper is a comprehensive knowledge management platform built for competitive programmers and developers. It allows users to scrape coding problems directly from platforms like Codeforces, CodeChef, and GeeksforGeeks using a custom Chrome Extension, and organize them into dynamic, shareable folders.

With features like real-time private chat, a unified contest calendar, and AWS S3-backed resource management for PDFs and audio notes, CodeKeeper is the ultimate workspace for algorithmic preparation.

---

## ✨ Core Features

- 🧩 **Custom Chrome Extension (Manifest V3):** Automatically extract problem details (tags, URLs, titles) from active webpages (Codeforces, CodeChef, GFG) and seamlessly sync them to specific user folders.
- 🔐 **Secure Dual-Authentication:** Robust login flow supporting both standard email/password (JWT) and Google OAuth 2.0.
- 🗂️ **Dynamic Resource Management:** Create nested folders to store problems and study materials. Integrates **AWS S3** via Multer memory streams for zero-persistence processing of PDFs, article links, solution images, and browser-recorded audio notes.
- 🔗 **Tokenized Public Sharing:** Generate secure, revocable public URLs for read-only sharing of curated problem folders and study resources.
- 🌐 **Community & Collaboration:** A public feed featuring nested discussion threads. Users can share insights and seamlessly "clone" public coding problems into their personal bookmarks.
- 💬 **Real-Time Communication:** 1:1 private messaging engine powered by **Socket.IO**, featuring optimistic UI updates, room joins, and delivered/read receipts.
- 📅 **Unified Contest Calendar:** An aggregated dashboard tracking upcoming coding contests across various competitive programming platforms.
- 👤 **Customizable User Profiles:** Public and private profiles showcasing coding skills, platform handles, and avatars.

---

## 🛠️ Tech Stack

### Frontend

- **React (v19)** & **React Router** for responsive Single Page Application (SPA) routing.
- **Axios** for API communication.
- **Socket.IO-Client** for real-time WebSocket connections.
- **React-Toastify** & **React-Icons** for UI feedback and design.

### Backend

- **Node.js** & **Express.js** for high-performance REST APIs.
- **MongoDB** & **Mongoose** for scalable NoSQL data modeling.
- **Socket.IO** for real-time bidirectional event handling.
- **AWS S3 SDK** & **Multer** for cloud media storage and memory streaming.
- **JWT** & **Bcryptjs** / **Google Auth Library** for authentication and password hashing.

### Browser Extension

- **Chrome Extension API (Manifest V3)** for background service workers and content scripts.

---

## 🚀 Local Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (Local instance or MongoDB Atlas)
- AWS S3 Bucket with appropriate IAM access keys
- Google Cloud Console account (for OAuth Client ID)

### 1. Clone the Repository

```bash
git clone https://github.com/adityapwr87/CodeKeeper.git
cd CodeKeeper
```

### 2. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` directory and add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
FRONTEND_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start the React application:

```bash
npm start
```

### 4. Chrome Extension Setup

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right corner).
3. Click on **Load unpacked** and select the extension directory from your cloned repository.
4. Update the extension's API endpoint to point to your local backend (`http://localhost:5000`) if necessary.

---

## 📝 Usage Guide

1. Create an account via email/password or use Google Sign-In.
2. In the "My Bookmarks" dashboard, create folders to organize your study materials.
3. While browsing coding platforms, use the Chrome Extension to automatically save problems to your desired folder.
4. Upload PDFs, solution screenshots, or record voice memos natively within the app.
5. Generate public links for folders to share study packs with peers.
6. Connect with other users and chat via the real-time messaging interface.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
