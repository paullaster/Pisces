FROM node:21.6.2-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 3500

# Start the application using PM2
CMD ["pm2-runtime", "production", "ecosystem.config.js"]
