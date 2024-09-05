# Use Node.js 20.16.1 base image
FROM node:18

# Install Python for Node.js modules that require it
RUN apt-get update && apt-get install -y python3 python3-pip build-essential

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt to ensure compatibility
# RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 10000

# Start the application
CMD ["npm", "run", "dev"]
