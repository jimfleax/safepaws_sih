#!/bin/bash

# Kill child processes on script exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "Starting Backend with nodemon..."
(cd backend && npx nodemon --exec "npx tsx" server.src.ts --watch src --watch server.src.ts --ext ts,js,json) &

echo "Starting Frontend with Vite..."
(cd frontend && npm run dev) &

echo "Both servers are starting. Press Ctrl+C to stop."
wait
