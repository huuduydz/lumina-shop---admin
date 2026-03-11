#!/bin/bash

# Lumina Shop & Admin - Start both servers

echo "🚀 Starting Lumina Shop & Admin..."
echo ""

# Check if MySQL is running (if using Docker)
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Make sure MySQL is running on localhost:3306"
else
    echo "🐳 Starting MySQL with Docker..."
    docker-compose up -d mysql
    sleep 5
fi

# Start Backend
echo ""
echo "📡 Starting Backend Server..."
cd server
npm install --production > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend Server..."
cd ..
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All servers started!"
echo ""
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait
