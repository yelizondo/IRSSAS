FROM node:14

WORKDIR /

COPY ./package.json .

RUN npm install

COPY ./ .

EXPOSE 3000

CMD [ "npm", "start" ]