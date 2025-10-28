# Todo App

A full-stack todo application built with React Native (Expo) for the frontend and Node.js/Express for the backend.

## 📱 Project Structure

```
to_do_app/
├── backend/          # Node.js/Express API server
│   ├── server.js     # Main server file
│   └── package.json  # Backend dependencies
├── mobile/           # React Native (Expo) mobile app
│   ├── App.js        # Main React Native component
│   ├── app.json      # Expo configuration
│   ├── package.json  # Mobile app dependencies
│   └── .prettierrc   # Code formatting configuration
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Mobile device** with Expo Go app installed, OR
- **iOS Simulator** (Mac only) / **Android Emulator**

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd to_do_app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:3000`

**Available API Endpoints:**
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create a new todo
- `DELETE /api/todos/:id` - Delete a todo by ID

### 3. Mobile App Setup

```bash
# Navigate to mobile directory (from project root)
cd mobile

# Install dependencies
npm install

# Start the Expo development server
npm start
```

This will open the Expo Developer Tools in your browser. You can then:
- Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser

## 🛠️ Development

### Backend Development

The backend uses an in-memory array to store todos (data is lost when server restarts). 

**Key files:**
- `server.js` - Main Express server with CORS enabled
- Uses nodemon for auto-restart during development

**Development commands:**
```bash
cd backend
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
```

### Mobile App Development

The mobile app is built with Expo and React Native.

**Key files:**
- `App.js` - Main application component
- `app.json` - Expo configuration
- `.prettierrc` - Code formatting rules

**Development commands:**
```bash
cd mobile
npm start        # Start Expo dev server
npm run android  # Start on Android
npm run ios      # Start on iOS
npm run web      # Start web version
```

### Code Formatting

The project uses Prettier for code formatting:
- **Auto-format on save** is enabled in VS Code
- Prettier config is in `mobile/.prettierrc`
- Uses single quotes, semicolons, and 2-space indentation

To manually format code:
```bash
cd mobile
npx prettier --write App.js
```

## 🔧 Configuration

### Backend Configuration

- **Port**: 3000 (hardcoded in `server.js`)
- **CORS**: Enabled for all origins
- **Data**: In-memory storage (todos array)

### Mobile App Configuration

- **API URL**: Update the IP address in `App.js` to match your development machine:
  ```javascript
  const fetchTodos = await fetch("http://YOUR_IP_ADDRESS:3000/api/todos");
  ```
- **Expo**: Uses new architecture enabled
- **Dependencies**: React Native Paper for UI components

## 📝 Current Features

- ✅ View list of todos
- ✅ Add new todos
- ✅ Delete todos
- ✅ Loading states
- ✅ Error handling

## 🔄 Development Workflow

### Making Changes

1. **Backend changes**: Edit `backend/server.js` - nodemon will auto-restart
2. **Mobile changes**: Edit `mobile/App.js` - Expo will hot-reload
3. **Save files**: VS Code will auto-format with Prettier

### Network Setup

The mobile app needs to connect to your backend server. Make sure:

1. Your computer and mobile device are on the same network
2. Update the IP address in `App.js` to your computer's local IP
3. The backend server is running on port 3000

To find your local IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

## 🐛 Troubleshooting

### Common Issues

1. **"Network request failed"**: 
   - Check if backend server is running
   - Verify IP address in `App.js` matches your computer's IP
   - Ensure both devices are on same network

2. **Metro bundler issues**:
   ```bash
   cd mobile
   expo start --clear
   ```

3. **iOS Simulator not working**:
   - Make sure Xcode is installed (Mac only)
   - Try `expo start --ios`

4. **Android Emulator issues**:
   - Ensure Android Studio and emulator are set up
   - Try `expo start --android`

## 📦 Dependencies

### Backend
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables (not currently used)
- **mongoose**: MongoDB ODM (not currently used)
- **nodemon**: Development auto-restart

### Mobile
- **expo**: React Native platform
- **react**: Core React library
- **react-native**: Mobile framework
- **react-native-paper**: Material Design components
- **axios**: HTTP client (installed but not used)
- **@react-native-async-storage/async-storage**: Local storage

## 🚀 Next Steps

Potential improvements:
- [ ] Add persistent database (MongoDB/PostgreSQL)
- [ ] Implement todo completion toggle
- [ ] Add todo editing functionality
- [ ] Implement user authentication
- [ ] Add due dates and priorities
- [ ] Deploy backend to cloud service
- [ ] Build and deploy mobile app to app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code is formatted (Prettier will auto-format)
5. Test both backend and mobile app
6. Submit a pull request

---

**Happy coding! 🎉**
