# # Set the base image and create a build stage
# FROM node:16 as build-stage 
# # Set the working directory in the container

# WORKDIR /frontend
# # Add /frontend/node_modules/.bin to the path environment variable

# # ENV PATH=/frontend/node_modules/.bin:$PATH

# # Copy package.json file to the container

# COPY package.json .

# # Install dependencies using npm

# RUN chown -R  node:root /usr/local/lib/node_modules/ && \
#     npm install --legacy-peer-deps --verbose --loglevel=error

# # RUN npm install --legacy-peer-deps --verbose --loglevel=error

# # # Change the owner of the node_modules directory to the current user
# # RUN chown -R node:root /frontend/node_modules
# # # Copy all files from local directory to container

# COPY . .
# # Run the build command to build the frontend application

# RUN npm run build

# # Install serve globally in the container
# RUN npm install -g serve --unsafe-perm=true --allow-root --verbose --loglevel=error

# # Set the command to run when the container starts
# CMD ["npm", "start"]

# # Expose the port used by the frontend application
# EXPOSE 3000
# Set the base image and create a build stage
FROM node:16 as build-stage 

# Set the working directory in the container
WORKDIR /frontend

# Remove the node_modules directory

# Copy package.json file to the container
COPY package.json .

# Install dependencies using npm
RUN chown -R node:root /usr/local/lib/node_modules/ && \
    npm install --legacy-peer-deps --verbose --loglevel=error --force

# Copy all files from local directory to container
COPY . .

# Run the build command to build the frontend application
RUN npm run build

# Install serve globally in the container
RUN npm install -g serve --unsafe-perm=true --allow-root --verbose --loglevel=error

# Set the command to run when the container starts
CMD ["npm", "start"]

# Expose the port used by the frontend application
EXPOSE 3000
