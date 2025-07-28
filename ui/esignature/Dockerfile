# FROM node:16.20.2 as angular

# # Set the working directory to D:/docker/WORKDIR/fontend/esignature/node
# WORKDIR /d/docker/WORKDIR/fontend/node

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Copy the rest of the application
# COPY . .

# # Install Angular CLI
# RUN npm install -g @angular/cli@16

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Build the Angular app for production
# # RUN ng build --prod
# # RUN ng s

# # Tomcate setup
# # FROM tomcat:9.0

# # Set the working directory to D:/docker/WORKDIR/fontend/esignature
# # WORKDIR /d/docker/WORKDIR/

# # Copy the built Angular app from the build stage to the Tomcat webapps directory
# # COPY --from=angular /d/docker/WORKDIR/fontend/node/dist/esignature .

# # Expose port 8080
# EXPOSE 4200:4200

# # Start Tomcat server
# CMD ["catalina.sh", "run"]



# Use the Node.js image as the base image
FROM node:16.20.2 as angular

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source code into the container
COPY . .

# Install Angular CLI globally (optional, only if not included in the project)
RUN npm install -g @angular/cli

# Expose the port where the app will run
EXPOSE 4200

# Start the Angular app using ng serve (this ensures live reloading)
CMD ["ng", "serve", "--host", "0.0.0.0"]