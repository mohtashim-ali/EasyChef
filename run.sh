#!/bin/bash

# Run the backend server
echo "Starting backend server..."
if [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    source venv/bin/activate    # ADDED 
    python back-end/manage.py runserver &
else 
    source venv/bin/activate     # ADDED 
    python3 back-end/manage.py runserver &
fi

# Run the frontend server
echo "Starting frontend server..."
cd front-end/
npm start