# Use Node.js 18 alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["npm", "start"]