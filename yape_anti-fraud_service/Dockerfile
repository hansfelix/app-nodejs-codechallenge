FROM node:16.13.0-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production



# Bundle app source


EXPOSE 3001
CMD [ "npm", "run", "start:dev" ]