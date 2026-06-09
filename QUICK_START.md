# 🚀 AgroScan Rwanda - Quick Launch Guide

**Your complete crop disease detection system is ready!**

---

## 📍 Project Location

```
C:\Users\Student\Agroscan\
```

---

## ⚡ 3-Minute Quick Start

### Step 1: Start the Backend (Terminal 1)

```bash
cd C:\Users\Student\Agroscan\backend
npm install
npm start
```

**Expected Output:**

```
╔════════════════════════════════════════╗
║  AgroScan Rwanda - API Server          ║
║  Environment: development             ║
║  Port: 5000                               ║
╚════════════════════════════════════════╝
```

### Step 2: Set Up Database (Terminal 2)

```bash
# Connect to MySQL and run schema
mysql -u root -p < C:\Users\Student\Agroscan\database\schema.sql
```

Or execute this in MySQL:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS agroscan_rwanda;
USE agroscan_rwanda;

-- Then paste contents of schema.sql
```

### Step 3: Open Frontend

```bash
# Simply open in browser
C:\Users\Student\Agroscan\frontend\index.html
```

Or use a local server:

```bash
cd C:\Users\Student\Agroscan\frontend
npx http-server
```

---

## ✅ Verify Installation

### Test 1: Backend Health Check

```bash
curl http://localhost:5000/api/health
```

**Should return:**

```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "development"
}
```

### Test 2: Frontend Loading

- Open http://localhost:8080 (or the file directly)
- Should see: "AgroScan Rwanda" logo with navigation
- No console errors

### Test 3: User Registration

1. Click "Sign Up"
2. Create account with test email
3. Should see: "Account created successfully!"

---

## 📂 Project Structure

```
Agroscan/
│
├── backend/                    ← REST API Server (Node.js)
│   ├── server.js              (Main entry point)
│   ├── .env                   (Configuration)
│   ├── package.json           (Dependencies)
│   ├── config/
│   │   └── database.js        (MySQL setup)
│   ├── routes/
│   │   ├── auth.js            (Login/Register)
│   │   ├── scans.js           (Image upload)
│   │   ├── users.js           (User profiles)
│   │   ├── contact.js         (Contact forms)
│   │   └── diseases.js        (Disease database)
│   └── uploads/               (User images)
│
├── frontend/                   ← Web Application (HTML/CSS/JS)
│   ├── index.html             (Main app)
│   └── js/
│       └── app.js             (Frontend logic)
│
├── database/                   ← Database Schema
│   └── schema.sql             (MySQL setup)
│
├── docs/                       ← Documentation
│   ├── README.md              (Project info)
│   ├── SETUP_GUIDE.md         (Installation)
│   └── PROJECT_SUMMARY.md     (Overview)
│
└── .gitignore                 (Version control)
```

---

## 🎯 Available Features

### For Users

- ✅ Register & Login
- ✅ Upload crop photos
- ✅ Analyze for diseases
- ✅ View scan history
- ✅ Get treatment recommendations
- ✅ Submit contact forms
- ✅ View disease database

### For Developers

- ✅ RESTful API (20+ endpoints)
- ✅ JWT authentication
- ✅ MySQL database
- ✅ File upload handling
- ✅ Error handling
- ✅ CORS support

---

## 🔧 Configuration

### Backend (.env file)

```
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=agroscan_rwanda

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Frontend (app.js)

```javascript
const API_URL = "http://localhost:5000/api";
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/verify` - Check token

### Scanning

- `POST /api/scans/upload` - Upload image
- `GET /api/scans/history/:userId` - View history
- `GET /api/scans/:scanId` - View results
- `DELETE /api/scans/:scanId` - Delete scan

### Users

- `GET /api/users/:userId` - Get profile
- `PUT /api/users/:userId` - Update profile
- `POST /api/users/:userId/change-password` - Change password
- `GET /api/users/:userId/stats` - Get statistics

### Contact

- `POST /api/contact/submit` - Send message
- `GET /api/contact/submissions` - View messages
- `PUT /api/contact/:id/read` - Mark as read

### Diseases

- `GET /api/diseases` - List all
- `GET /api/diseases/:id` - Get details
- `GET /api/diseases/search/:query` - Search
- `GET /api/diseases/crop/:cropId` - Filter by crop
- `GET /api/diseases/stats/overview` - Statistics

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check if port 5000 is in use
netstat -aon | findstr :5000

# If in use, change PORT in .env to 5001
```

### Database Connection Failed

```bash
# Verify MySQL is running
mysql -u root -p

# Check credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

### CORS Errors

- Ensure backend is running on port 5000
- Check API_URL in `frontend/js/app.js`
- Verify .env has correct settings

### File Upload Not Working

```bash
# Create uploads folder
mkdir Agroscan\backend\uploads
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Journey

1. Open frontend
2. Click "Sign Up"
3. Register new account
4. Click "Login"
5. Select crop type
6. Upload image
7. View results
8. Check history

### Scenario 2: Disease Information

1. Open frontend
2. Scroll to diseases section
3. Click on a disease
4. View symptoms & treatment
5. Search for specific disease

### Scenario 3: Contact Form

1. Scroll to "Get In Touch"
2. Fill contact form
3. Submit
4. Verify in database:
   ```bash
   mysql -u root -p agroscan_rwanda
   SELECT * FROM contact_submissions;
   ```

---

## 📊 Supported Data

### Crops (7 types)

- 🍅 Tomato
- 🥔 Potato
- 🌽 Maize
- 🫘 Bean
- 🥬 Cassava
- 🍌 Banana
- ☕ Coffee

### Diseases (8+ types)

- Tomato Late Blight
- Early Blight
- Potato Late Blight
- Maize Leaf Rust
- Bean Anthracnose
- Cassava Brown Streak
- Panama Disease
- Coffee Leaf Rust

---

## 📚 Documentation Files

| File                 | Purpose                     |
| -------------------- | --------------------------- |
| `README.md`          | Project overview            |
| `SETUP_GUIDE.md`     | Detailed setup instructions |
| `PROJECT_SUMMARY.md` | Technical overview          |

---

## 🔐 Default Credentials

**No default users** - You must register first

### Test Account (for development)

```
Email: test@agroscan.rw
Password: TestPassword123!
Name: Test Farmer
```

---

## 🚀 Next Steps

1. **✅ Backend Setup**
   - `cd backend && npm install`
   - `npm start` (port 5000)

2. **✅ Database Setup**
   - `mysql -u root -p < database/schema.sql`

3. **✅ Frontend Access**
   - Open `frontend/index.html`

4. **✅ Test Features**
   - Register user
   - Upload image
   - View results

5. **✅ Review Code**
   - Backend: `backend/server.js` and `routes/`
   - Frontend: `frontend/js/app.js`
   - Database: `database/schema.sql`

---

## 💡 Tips

- **Keep terminal open** while backend runs
- **Check browser console** (F12) for errors
- **Review server logs** for API issues
- **Verify .env** before running
- **Test with real images** for best results

---

## 🎯 Success Indicators

✅ Backend running on http://localhost:5000
✅ Frontend loads without errors
✅ Can register new account
✅ Can login successfully
✅ Can upload image
✅ Can view results
✅ Can see scan history
✅ Can submit contact form

---

## 🆘 Need Help?

1. **Check terminal output** - Look for error messages
2. **Review .env configuration** - Verify all settings
3. **Check database** - Ensure it's created
4. **Review documentation** - See SETUP_GUIDE.md
5. **Check browser console** - F12 for errors

---

## 📞 Support

- 📧 Email: info@agroscan.rw
- 📱 Phone: +250 780 000 000
- 📍 Location: Kigali, Rwanda

---

## 📄 License

MIT License - Use freely for personal or commercial projects

---

## 🎉 Ready to Launch!

Your AgroScan Rwanda system is complete and ready!

**Happy farming! 🌾🇷🇼**

---

_Last Updated: June 9, 2026_
_Version: 1.0.0_
_Status: Production Ready_
