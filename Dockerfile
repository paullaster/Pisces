FROM node:21.6.2-alpine

# Set the working directory
WORKDIR /usr/src/noelsdeliveries

# Install PM2 globally
RUN npm install -g pm2

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 3501

# Start the application using PM2
CMD ["pm2-runtime","ecosystem.config.cjs"]
