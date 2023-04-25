#!/bin/bash

# Install dependencies for backend
echo "Preparing installation for backend..."
python3 -m venv venv
source venv/bin/activate
pip install -r back-end/requirements.txt
pip install django-cors-headers
python back-end/manage.py makemigrations 
python back-end/manage.py migrate

# Install dependencies for frontend
echo "Preparing installation for frontend..."
cd front-end/
npm install
cd ../

echo "Setup complete!"