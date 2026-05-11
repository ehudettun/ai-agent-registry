#!/bin/bash

echo "🚀 Starting AI Agent Registry..."
echo ""

# Start backend
echo "Starting backend on port 3001..."
cd backend
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ AI Agent Registry is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
