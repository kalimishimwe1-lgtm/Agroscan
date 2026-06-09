# AgroScan Rwanda - Complete Setup Guide

## 🎯 Step-by-Step Installation

### Step 1: System Requirements ✓

Before starting, ensure you have:

- Node.js v14 or higher
- MySQL Server 5.7 or higher
- npm (bundled with Node.js)
- Git (optional)

### Step 2: Backend Installation

#### 2.1 Navigate to Backend Folder

```bash
cd Agroscan/backend
```

#### 2.2 Install Dependencies

```bash
npm install
```

This will install:

- express (Web framework)
- mysql2 (Database driver)
- bcrypt (Password hashing)
- jsonwebtoken (Authentication)
- cors (Cross-origin support)
- multer (File uploads)
- dotenv (Environment variables)

#### 2.3 Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema
source ../database/schema.sql;
```

Or in one command:

```bash
mysql -u root -p < ../database/schema.sql
```

#### 2.4 Environment Configuration

Edit `.env` file in `backend/` folder:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agroscan_rwanda

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# API Configuration
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

#### 2.5 Start Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

Expected output:

```
╔════════════════════════════════════════╗
║  AgroScan Rwanda - API Server          ║
║  Environment: development             ║
║  Port: 5000                               ║
╚════════════════════════════════════════╝
```

### Step 3: Frontend Setup

#### 3.1 Simple Method - Open in Browser

```bash
# Simply open the file
Agroscan/frontend/index.html
```

#### 3.2 Alternative Method - Local Server

```bash
# Navigate to frontend folder
cd Agroscan/frontend

# Serve with http-server (if installed globally)
npx http-server

# Or use Python's built-in server
python -m http.server 8000

# Or use Node.js server
npx serve
```

Then open: `http://localhost:8000`

### Step 4: Verify Installation

#### 4.1 Test Backend

```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-09T...",
  "environment": "development"
}
```

#### 4.2 Test Frontend

Open `http://localhost:8000` and verify:

- Navigation bar loads
- Login/Sign Up buttons visible
- Scan section accessible
- No console errors

---

## 🔧 Common Setup Issues

### Issue 1: MySQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:

- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

### Issue 2: Port 5000 Already in Use

**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solution**:

```bash
# Change PORT in .env to 5001 (or any free port)
PORT=5001

# Then restart the server
```

### Issue 3: npm install Failed

**Error**: `gyp ERR! build error`

**Solution**:

- Install build tools: `npm install -g build-essential`
- Delete node_modules: `rm -rf node_modules`
- Clear npm cache: `npm cache clean --force`
- Reinstall: `npm install`

### Issue 4: File Upload Not Working

**Error**: `ENOENT: no such file or directory, open 'uploads/...`

**Solution**:

```bash
# Create uploads folder
mkdir Agroscan/backend/uploads

# Set proper permissions
chmod 755 Agroscan/backend/uploads
```

---

## 📊 Database Verification

### Check if Database Exists

```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'agroscan%';"
```

### Check Tables

```bash
mysql -u root -p agroscan_rwanda -e "SHOW TABLES;"
```

### View Sample Data

```bash
mysql -u root -p agroscan_rwanda -e "SELECT * FROM crops;"
mysql -u root -p agroscan_rwanda -e "SELECT * FROM diseases;"
```

---

## 🧪 Testing the Application

### Manual Testing Steps

#### 1. Register a User

1. Click "Sign Up" button
2. Fill in: Name, Email, Password
3. Click "Create Account"
4. Check console for success message

#### 2. Login

1. Click "Login" button
2. Enter email and password from registration
3. Click "Login"
4. Verify navbar updates (Logout button visible)

#### 3. Upload and Scan

1. Select a crop type
2. Click "Browse Files" or "Use Camera"
3. Select an image from your device
4. Click "Analyze Crop"
5. View results and recommendations

#### 4. Check History

1. Click "History" in navigation
2. View all your previous scans
3. Verify scan count displays

#### 5. Submit Contact Form

1. Scroll to "Contact" section
2. Fill in: Name, Email, Subject, Message
3. Click "Send Message"
4. Verify success message

---

## 📡 API Testing with cURL

### Test Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

### Test Diseases

```bash
curl http://localhost:5000/api/diseases
```

### Test Contact

```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Farmer",
    "email":"john@farm.rw",
    "subject":"Disease Help",
    "message":"My crops are sick"
  }'
```

---

## 🔐 Security Configuration

### Generate Strong JWT Secret

```bash
# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `.env`:

```
JWT_SECRET=your_generated_secret_here
```

### Change Default Passwords

After first login, change your password in user settings.

### Database User Permissions

```sql
-- Create limited user for app
CREATE USER 'agroscan_user'@'localhost' IDENTIFIED BY 'strong_password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON agroscan_rwanda.*
TO 'agroscan_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Update .env to use this user
```

---

## 📦 Production Deployment

### Before Deployment

1. **Update .env**

   ```
   NODE_ENV=production
   API_URL=https://api.yourdomain.com
   CLIENT_URL=https://yourdomain.com
   JWT_SECRET=use_your_strong_secret
   ```

2. **Update Database**

   ```
   DB_USER=agroscan_user
   DB_PASSWORD=strong_password
   ```

3. **Enable HTTPS**
   - Get SSL certificate
   - Configure in nginx/Apache

4. **Setup Environment**
   - Deploy on Linux server
   - Use PM2 for process management
   - Setup reverse proxy (nginx)

### Deployment Command

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name "agroscan"

# Startup script
pm2 startup
pm2 save
```

---

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [MySQL Reference](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/) - JWT Tokens
- [MDN Web Docs](https://developer.mozilla.org/) - Web Standards

---

## 🆘 Getting Help

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Review `.env` configuration
4. Verify database connections
5. Check file permissions

---

## ✅ Verification Checklist

- [ ] Node.js v14+ installed
- [ ] MySQL Server running
- [ ] Backend dependencies installed
- [ ] Database created with schema
- [ ] `.env` file configured
- [ ] Backend server running on port 5000
- [ ] Frontend accessible in browser
- [ ] Can see health check at `/api/health`
- [ ] Can register new user
- [ ] Can login with created user
- [ ] Can upload and analyze crop image
- [ ] Can view scan history
- [ ] Can submit contact form

---

**Setup Complete! 🎉**

Your AgroScan Rwanda application is ready to use. Start helping Rwandan farmers detect crop diseases!

For questions or issues, contact: info@agroscan.rw
