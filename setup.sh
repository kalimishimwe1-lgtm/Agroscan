#!/bin/bash
# AgroScan Rwanda - Installation & Launch Script
# Automates setup process for quick deployment

set -e  # Exit on error

echo "╔════════════════════════════════════════╗"
echo "║  AgroScan Rwanda Setup Script          ║"
echo "║  Automated Installation & Launch       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check dependencies
echo -e "${BLUE}[1/5]${NC} Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found$(node -v)${NC}"

if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL client not found${NC}"
    echo "Install from: https://www.mysql.com/"
fi
echo ""

# Step 2: Backend setup
echo -e "${BLUE}[2/5]${NC} Setting up backend..."
cd "$(dirname "$0")/backend"

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install --silent
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    echo "Create .env with your database credentials"
fi
echo ""

# Step 3: Database setup
echo -e "${BLUE}[3/5]${NC} Database configuration..."
echo "To create database, run:"
echo -e "${YELLOW}mysql -u root -p < ../database/schema.sql${NC}"
echo ""

# Step 4: Frontend check
echo -e "${BLUE}[4/5]${NC} Frontend verification..."
FRONTEND_FILE="../frontend/index.html"
if [ -f "$FRONTEND_FILE" ]; then
    echo -e "${GREEN}✓ Frontend found${NC}"
else
    echo -e "${RED}❌ Frontend not found${NC}"
    exit 1
fi
echo ""

# Step 5: Start server
echo -e "${BLUE}[5/5]${NC} Starting backend server..."
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  AgroScan Rwanda - Ready to Launch     ║${NC}"
echo -e "${GREEN}║  Backend: http://localhost:5000        ║${NC}"
echo -e "${GREEN}║  Frontend: Open frontend/index.html    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

npm start
