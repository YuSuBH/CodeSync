# CollabCode 🚀

A real-time collaborative code editor that allows multiple developers to write, edit, and execute code together seamlessly. Built with React, Node.js, Socket.io, and Monaco Editor.

## ✨ Features

- **Real-Time Collaboration** - See your teammates' code changes instantly as they type
- **Live Cursor Tracking** - View where other users are editing in real-time
- **Multi-Language Support** - Write code in JavaScript, Python, Java, C++, and many more languages
- **Code Execution** - Run code directly in the browser and see results instantly
- **Room-Based Sessions** - Create or join coding rooms with unique room IDs
- **User Presence** - See who's currently in your room
- **Connection Status** - Real-time connection monitoring
- **Syntax Highlighting** - Powered by Monaco Editor (VS Code's editor)

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor component
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket communication
- **Axios** - HTTP client for code execution API
- **Piston API** - Code execution service

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/collabcode.git
   cd collabcode
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   NODE_ENV=development
   PISTON_API_URL=https://emkc.org/api/v2/piston
   ```

### Running the Application

#### Development Mode

**Option 1: Run Backend and Frontend Separately**

Terminal 1 (Backend):

```bash
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend
npm run dev
```

**Option 2: Production Build**

```bash
npm run build
npm start
```

The application will be available at:

- Frontend (dev): `http://localhost:5173`
- Backend: `http://localhost:3000`
- Production: `http://localhost:3000`

## 📖 Usage

1. **Create or Join a Room**

   - Open the application in your browser
   - Click "Get Started"
   - Enter a room ID (or generate one) and your name
   - Share the room ID with teammates

2. **Write Code Together**

   - Select your preferred programming language
   - Start typing - changes sync in real-time
   - See your teammates' cursors and selections

3. **Execute Code**

   - Click the "Run" button to execute your code
   - View output in the output panel
   - Results are shared with all users in the room

4. **Leave Room**
   - Click "Leave Room" when you're done
   - Other users will be notified of your departure

## 🏗️ Project Structure

```
collabcode/
├── backend/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── services/        # Business logic (Room, Piston API)
│   ├── socket/          # Socket.io handlers
│   ├── utils/           # Utility functions
│   └── index.js         # Entry point
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── constants/   # Constants and configuration
│   │   ├── hooks/       # Custom React hooks
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main App component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── package.json
```

## 🔑 Key Features Explained

### Real-Time Synchronization

Uses Socket.io to broadcast code changes, cursor positions, and selections to all connected users in a room.

### Code Execution

Integrates with the Piston API to support code execution for 40+ programming languages without server-side setup.

### Room Management

- Automatic room cleanup after inactivity
- User presence tracking
- Graceful disconnect handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- None at the moment

## 🚧 Future Enhancements

- [ ] Add video/voice chat
- [ ] File tree and multiple file support
- [ ] Syntax error highlighting
- [ ] Code formatting
- [ ] Chat functionality
- [ ] User authentication
- [ ] Room persistence
- [ ] Code history and version control
- [ ] Customizable themes

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

Built with ❤️ for developers
