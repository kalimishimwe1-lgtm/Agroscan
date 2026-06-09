# 📋 Installation Checklist

## Pre-Installation Requirements

### System Requirements

- [ ] Windows 10/11 or macOS/Linux
- [ ] At least 2GB free disk space
- [ ] Internet connection for npm packages

### Software Prerequisites

- [ ] Node.js v14+ installed
- [ ] npm v6+ installed
- [ ] MySQL Server 5.7+ running
- [ ] Web browser (Chrome, Firefox, Safari, Edge)

### Optional but Recommended

- [ ] Visual Studio Code or code editor
- [ ] Postman for API testing
- [ ] MySQL Workbench or command line tool

---

## Installation Steps

### Step 1: Verify Dependencies

- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] MySQL running: `mysql -u root -p` (type password then exit)

### Step 2: Backend Setup

- [ ] Navigate to: `Agroscan/backend/`
- [ ] Run: `npm install`
- [ ] Verify: `node_modules/` folder created
- [ ] Check: `.env` file exists
- [ ] Update: `.env` with your MySQL credentials

### Step 3: Database Setup

- [ ] MySQL server is running
- [ ] Execute: `mysql -u root -p < ../database/schema.sql`
- [ ] Verify: Database `agroscan_rwanda` created
- [ ] Verify: 8 tables created (`SHOW TABLES;`)
- [ ] Verify: Sample data inserted (7 crops, 8 diseases)

### Step 4: Start Backend Server

- [ ] Navigate to: `Agroscan/backend/`
- [ ] Run: `npm start`
- [ ] Verify: "Port: 5000" message appears
- [ ] No error messages in terminal
- [ ] Keep terminal window open

### Step 5: Frontend Verification

- [ ] Open: `Agroscan/frontend/index.html`
- [ ] Or serve: `npx http-server Agroscan/frontend`
- [ ] Verify: Logo and navigation visible
- [ ] Verify: No console errors (F12)
- [ ] Browser shows: "AgroScan Rwanda"

---

## Feature Testing

### Authentication Testing

- [ ] Click "Sign Up" button
- [ ] Fill registration form
- [ ] Submit registration
- [ ] See success message
- [ ] Click "Login"
- [ ] Enter credentials
- [ ] Successfully logged in
- [ ] "Logout" button appears
- [ ] "History" link appears

### Crop Scanning

- [ ] Select crop type
- [ ] Click "Browse Files"
- [ ] Select an image file
- [ ] Image preview shows
- [ ] Click "Analyze Crop"
- [ ] Loading animation appears
- [ ] Results display
- [ ] Recommendations show

### Scan History

- [ ] Click "History" link (after login)
- [ ] View scan statistics
- [ ] See list of past scans
- [ ] Each scan shows date and status
- [ ] Pagination works (if multiple scans)

### Disease Database

- [ ] Scroll to "Disease Library"
- [ ] View list of diseases
- [ ] Click on a disease
- [ ] See symptoms and treatment
- [ ] Search functionality works
- [ ] Filter by crop works

### Contact Form

- [ ] Scroll to "Get In Touch"
- [ ] Fill contact form
- [ ] Enter: Name, Email, Subject, Message
- [ ] Click "Send Message"
- [ ] Success notification appears
- [ ] Form clears after submission

---

## API Verification

### Backend Health Check

- [ ] Run: `curl http://localhost:5000/api/health`
- [ ] Response status: 200 OK
- [ ] Response contains: `"status":"ok"`

### Test Registration API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User"
  }'
```

- [ ] Response status: 201 or 200
- [ ] Response contains: `success` or `message`

### Test Login API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

- [ ] Response status: 200
- [ ] Response contains: `token`
- [ ] Response contains: `user` object

### Test Diseases API

- [ ] Run: `curl http://localhost:5000/api/diseases`
- [ ] Response contains: Array of diseases
- [ ] Each disease has: id, name, scientific_name

### Test Contact API

```bash
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Farmer",
    "email":"test@farm.rw",
    "subject":"Help Needed",
    "message":"My crops are sick"
  }'
```

- [ ] Response status: 201 or 200
- [ ] Response contains: `submissionId` or success message

---

## Database Verification

### Check Database Exists

- [ ] Run: `SHOW DATABASES;`
- [ ] See: `agroscan_rwanda` in list

### Check Tables Created

- [ ] Run: `USE agroscan_rwanda; SHOW TABLES;`
- [ ] See 8 tables: users, crops, scans, detection_results, diseases, contact_submissions, notifications, sessions

### Check Sample Data

- [ ] Run: `SELECT * FROM crops;`
- [ ] See: 7 crops (Tomato, Potato, Maize, Bean, Cassava, Banana, Coffee)
- [ ] Run: `SELECT * FROM diseases;`
- [ ] See: 8+ diseases listed

### Check User Registration

After testing registration:

- [ ] Run: `SELECT * FROM users;`
- [ ] See: Your registered user

### Check Contact Submissions

After testing contact form:

- [ ] Run: `SELECT * FROM contact_submissions;`
- [ ] See: Your contact submission

---

## Performance Checks

### Page Load Time

- [ ] Frontend loads in < 3 seconds
- [ ] No rendering delays
- [ ] Images load smoothly

### API Response Time

- [ ] Login response < 2 seconds
- [ ] Disease list response < 1 second
- [ ] History load < 2 seconds

### File Upload

- [ ] Small image (1-2MB) uploads < 5 seconds
- [ ] Large image (5-10MB) uploads < 15 seconds
- [ ] Upload progress bar shows

---

## Security Checks

### HTTPS Status

- [ ] For development: OK to use HTTP
- [ ] For production: Implement HTTPS

### JWT Token Storage

- [ ] Token stored in localStorage
- [ ] Token sent with Authorization header
- [ ] Token expires after 7 days

### Password Hashing

- [ ] Passwords never stored in plain text
- [ ] Bcrypt used for hashing

### CORS Configuration

- [ ] Backend accepts requests from frontend URL
- [ ] No wildcard CORS in production

---

## Browser Compatibility

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Responsive Design Checks

### Desktop (1920x1080)

- [ ] All content visible
- [ ] No horizontal scrolling
- [ ] Proper spacing

### Tablet (768x1024)

- [ ] Content reflows properly
- [ ] Navigation accessible
- [ ] Buttons easily clickable

### Mobile (375x667)

- [ ] Full responsive layout
- [ ] Touch-friendly buttons
- [ ] No overflow content

---

## Environment Configuration

### Backend .env File

- [ ] DB_HOST set to: `localhost`
- [ ] DB_USER set to: `root` (or your user)
- [ ] DB_PASSWORD set: Correct password
- [ ] DB_NAME set to: `agroscan_rwanda`
- [ ] PORT set to: `5000`
- [ ] JWT_SECRET not empty
- [ ] NODE_ENV set to: `development`

### Frontend Configuration

- [ ] API_URL points to: `http://localhost:5000/api`
- [ ] No hardcoded tokens/secrets

---

## File Structure Verification

### Backend Files

- [ ] ✓ `server.js` exists
- [ ] ✓ `package.json` exists
- [ ] ✓ `.env` exists
- [ ] ✓ `config/database.js` exists
- [ ] ✓ `routes/auth.js` exists
- [ ] ✓ `routes/scans.js` exists
- [ ] ✓ `routes/users.js` exists
- [ ] ✓ `routes/contact.js` exists
- [ ] ✓ `routes/diseases.js` exists
- [ ] ✓ `uploads/` folder exists

### Frontend Files

- [ ] ✓ `index.html` exists
- [ ] ✓ `js/app.js` exists
- [ ] ✓ `css/` folder exists

### Database Files

- [ ] ✓ `database/schema.sql` exists
- [ ] ✓ Schema creates 8 tables
- [ ] ✓ Sample data included

### Documentation Files

- [ ] ✓ `README.md` exists
- [ ] ✓ `QUICK_START.md` exists
- [ ] ✓ `SETUP_GUIDE.md` exists
- [ ] ✓ `PROJECT_SUMMARY.md` exists

---

## Troubleshooting Verification

### If Backend Won't Start

- [ ] Check if port 5000 is free
- [ ] Verify Node.js is installed correctly
- [ ] Check for error messages in terminal
- [ ] Reinstall dependencies: `npm install`

### If Database Connection Fails

- [ ] Verify MySQL is running
- [ ] Check `.env` credentials
- [ ] Run: `mysql -u root -p` to verify access
- [ ] Ensure database exists

### If Frontend Shows Errors

- [ ] Check browser console (F12)
- [ ] Verify backend is running
- [ ] Check API_URL in app.js
- [ ] Clear browser cache

### If File Upload Fails

- [ ] Check `uploads/` folder exists
- [ ] Verify folder has write permissions
- [ ] Check file size limits

---

## Production Readiness

### Before Deployment

- [ ] All tests passed
- [ ] No console errors
- [ ] Database backed up
- [ ] .env configured properly
- [ ] JWT_SECRET changed
- [ ] NODE_ENV set to: `production`
- [ ] CORS configured for production domain

### Deployment Checklist

- [ ] Use production database credentials
- [ ] Enable HTTPS
- [ ] Set up domain/SSL certificate
- [ ] Configure hosting environment
- [ ] Database migrations tested
- [ ] Error logging configured
- [ ] Backup strategy implemented

---

## Final Verification

### Complete Installation Checklist

- [ ] All prerequisites installed
- [ ] Backend running successfully
- [ ] Database created and populated
- [ ] Frontend accessible and responsive
- [ ] User registration working
- [ ] User login working
- [ ] Crop analysis working
- [ ] API endpoints responding
- [ ] No console errors
- [ ] All features tested

### Ready to Launch

- [ ] System is production ready
- [ ] All security measures in place
- [ ] Documentation reviewed
- [ ] Backup strategy in place
- [ ] Team trained on system

---

## 🎉 Installation Complete!

**Your AgroScan Rwanda system is fully installed and ready for deployment.**

---

Date Verified: ****\_\_\_****
Verified By: ****\_\_\_****
Sign-off: ****\_\_\_****

---

_For detailed help, see SETUP_GUIDE.md_
_For quick start, see QUICK_START.md_
_For project info, see README.md_
