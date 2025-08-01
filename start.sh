#!/bin/bash

# Intern Dashboard Startup Script
echo "🚀 Starting Intern Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd server
    if [ ! -d "node_modules" ]; then
        npm install
    else
        echo -e "${GREEN}✅ Dependencies already installed${NC}"
    fi
    cd ..
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🖥️  Starting backend server...${NC}"
    cd server
    npm start &
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
    cd ..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🌐 Starting frontend server...${NC}"
    cd client
    
    # Check if Python is available for simple HTTP server
    if command -v python3 &> /dev/null; then
        echo -e "${GREEN}✅ Using Python HTTP server${NC}"
        python3 -m http.server 3000 &
        FRONTEND_PID=$!
    elif command -v python &> /dev/null; then
        echo -e "${GREEN}✅ Using Python HTTP server${NC}"
        python -m SimpleHTTPServer 3000 &
        FRONTEND_PID=$!
    elif command -v npx &> /dev/null; then
        echo -e "${GREEN}✅ Using npx serve${NC}"
        npx serve -p 3000 &
        FRONTEND_PID=$!
    else
        echo -e "${YELLOW}⚠️  No simple server found. Please open client/index.html manually in your browser${NC}"
        echo -e "${YELLOW}   Or install 'serve' globally: npm install -g serve${NC}"
        cd ..
        return
    fi
    
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
    cd ..
}

# Function to wait for servers to start
wait_for_servers() {
    echo -e "${YELLOW}⏳ Waiting for servers to start...${NC}"
    sleep 3
}

# Function to display access information
show_access_info() {
    echo ""
    echo -e "${GREEN}🎉 Intern Dashboard is now running!${NC}"
    echo ""
    echo -e "${BLUE}📍 Access URLs:${NC}"
    echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
    echo -e "   Backend API: ${GREEN}http://localhost:5000/api${NC}"
    echo ""
    echo -e "${YELLOW}🧪 Test Credentials:${NC}"
    echo -e "   Email: ${GREEN}alex@example.com${NC} (or any from the database)"
    echo -e "   Password: ${GREEN}any password${NC} (dummy auth)"
    echo ""
    echo -e "${BLUE}💡 Pro Tips:${NC}"
    echo -e "   • Press ${GREEN}Ctrl+T${NC} on forms to auto-fill test data"
    echo -e "   • Check the README.md for more test accounts"
    echo -e "   • API docs available in README.md"
    echo ""
    echo -e "${YELLOW}⏹️  To stop servers: Press Ctrl+C${NC}"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill any remaining processes on our ports
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}   🎯 Intern Dashboard Startup${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    check_node
    install_deps
    start_backend
    start_frontend
    wait_for_servers
    show_access_info
    
    # Keep script running
    echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
    while true; do
        sleep 1
    done
}

# Run main function
main