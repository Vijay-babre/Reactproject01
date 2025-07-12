# 🚀 Gemini Chat

**A full-stack chat application powered by MongoDB, Node.js, and the Gemini API**

---

## 👨‍💻 Developer
**Vijay Babre**  
*Frontend Developer*

---

## 📋 Overview
Gemini Chat is a modern chat application with a Node.js backend, MongoDB for data storage, and integration with the Gemini API for enhanced functionality. This guide provides step-by-step instructions to set up and run the backend server.

---

## 📥 Step 1: Clone the Repository
Clone the project to your local machine and navigate to the project directory:

```bash
git clone https://github.com/Prb9008/gemini-chat-backend.git
cd gemini-chat-backend
```

---

## ⚙️ Step 2: Set Up Environment Variables
Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=mongodb://localhost:27017/gemini-chat
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
```

### 🔑 Key Configuration
1. **MongoDB URI**:
   - Use `mongodb://localhost:27017/gemini-chat` for a local MongoDB instance.
   - For MongoDB Atlas, replace with your Atlas connection string.

2. **JWT_SECRET**:
   - Navigate to the `utils` folder:
     ```bash
     cd utils
     ```
   - Run the key generation script:
     ```bash
     node generateJwtSecret.js
     ```
   - Copy the generated secret and paste it into the `.env` file.

3. **GEMINI_API_KEY**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey).
   - Generate an API key and paste it into the `.env` file.

---

## 📦 Step 3: Install Dependencies
Install the required Node.js packages:

```bash
npm install
```

---

## ▶️ Step 4: Start the Backend Server
Run the server from the root directory:

```bash
node server.js
```

The server will start on `http://localhost:5000`.

---

## ✅ Verification
- Ensure MongoDB is running locally or connected via Atlas.
- Verify the server is accessible at `http://localhost:5000` in your browser or via a tool like Postman.
- Test API endpoints to confirm functionality.

---

## 🛠️ Troubleshooting
- **MongoDB Connection Error**: Verify MongoDB is running or check your `MONGO_URI`.
- **Port Conflict**: Change the `PORT` in the `.env` file if `5000` is in use.
- **Missing API Key**: Ensure the `GEMINI_API_KEY` is valid and correctly pasted.

---

## 🌟 Made with ❤️ by Pratham Babre
**Full Stack Developer**  
Feel free to reach out for support or contributions!