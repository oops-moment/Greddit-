FROM node:14

LABEL version="1.0"
LABEL description="Development image for the Library MERN API"

# create a non-root user with UID 1001 and GID 1001

WORKDIR /backend

COPY package*.json ./

RUN npm install --unsafe-perm=true --allow-root

COPY . .

EXPOSE 5000
EXPOSE 5001

CMD ["npm", "run", "dev"]
