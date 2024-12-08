#!/bin/bash

# Ensure you are in the directory where you want to create the project
# For example:
# cd ~/Projects/your-project-directory

echo "Creating frontend structure and initializing project..."

# Create frontend directory and navigate into it
mkdir -p frontend
cd frontend

# Initialize Vite project with React and TypeScript template
npm init vite@latest . -- --template react-ts -y

# Install frontend dependencies
npm install
npm install react-router-dom @mui/material @mui/styled-engine-sc styled-components @mui/icons-material @tanstack/react-query @tanstack/react-query-devtools
npm install --save-dev @types/react-router-dom

# Create directories and files
mkdir -p src/assets src/components src/context src/hooks src/pages src/services src/types src/utils
touch src/App.tsx
touch src/index.css
touch src/vite-env.d.ts
touch public/index.html

# Return to the root directory
cd ..

echo "Creating backend structure and initializing project..."

# Create backend directory and navigate into it
mkdir -p backend
cd backend

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express cors jsonwebtoken google-auth-library googleapis dotenv mongoose mongoose-encryption
npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/jsonwebtoken @types/cors @types/mongoose

# Initialize TypeScript configuration
npx tsc --init

# Create directories and files
mkdir -p src/routes src/middleware src/utils src/types src/models src/config src/services src/controllers 
touch src/index.ts
touch src/config/oauth2Client.ts
touch src/config/MongoDB.ts
touch src/middleware/authenticateJWT.ts
touch src/middleware/refreshToken.ts
touch src/routes/index.ts
touch src/routes/users.ts
touch src/services/authServices.ts
touch nodemon.json
touch .env

# Return to the root directory
cd ..

# Create README
touch README.md

echo "Project setup completed successfully!"
