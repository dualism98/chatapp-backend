const grpc = require("@grpc/grpc-js");
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config()

import express from 'express';
import fileUpload from 'express-fileupload';

import mongoose from 'mongoose';
import {createUser, getAllChats} from './src/routes/users';
import { getMessagesHistory, sendMessage, receiveMessages } from './src/routes/messages';
import {uploadRouter} from './src/routes/messages';

const PROTO_PATH = "./src/proto/chat.proto";
const SERVER_URI = "0.0.0.0:9090";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const expressApp = express();
expressApp.use('/uploads', express.static(__dirname + '/uploads'));
expressApp.use(fileUpload({createParentPath: true}));
expressApp.use('/upload', uploadRouter);

server.addService(protoDescriptor.ChatService.service, {
  createUser,
  getAllChats,
  getMessagesHistory,
  sendMessage,
  receiveMessages,
});

server.bindAsync(SERVER_URI, grpc.ServerCredentials.createInsecure(), async () => {
  await server.start();
  await mongoose.connect(process.env.DATABASE_URL!);
  expressApp.listen(3000);
  console.log("Server is running!");
});
