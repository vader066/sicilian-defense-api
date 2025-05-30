# Use lightweight Node.js base
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files first
COPY package.json yarn.lock ./
RUN yarn install

# Copy rest of the files and build
COPY . .
RUN yarn build

# Expose port (match your Express PORT)
EXPOSE 5001

# Run production build
CMD ["node", "dist/index.js"]
