import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';

import Message from "../models/Message";
import User from "../models/User";

const observers: any[] = [];

// @ts-expect-error
const getMessagesHistory = async (call, callback) => {
    const {userId, chatId} = call.request;
    const user = await User.findById(userId);

    if (!user) {
        return callback(null, {users: []});
    }

    const messages = await Message.find({from: {$in: [userId, chatId]}, to: {$in: [userId, chatId]}}, {}, {sort: {'date': -1}});

    callback(null, {messages});
}

// @ts-expect-error
const sendMessage = async (call, callback) => {
    const message = call.request
    const savedMessage = await Message.create(message);
    console.log('Message saved', savedMessage);
    observers.map(observer => {
        if (observer.id === savedMessage.to?.toString()) {
            observer.call.write(savedMessage);
        }
    })
    callback(null, {});
}

// @ts-expect-error
const receiveMessages = async (call, callback) => {
    const {userId} = call.request;
    console.log('UserId', userId);
    observers.push({
        id: userId,
        call,
    })
    console.log('Observers', observers);
}

const uploadRouter = Router();

uploadRouter.post('/video', async (req, res) => {
    try {
        if(!req.files) {
            return res.send({
                status: false,
                message: 'No file uploaded'
            });
        } 
        let video = req.files.file;
        var re = /(?:\.([^.]+))?$/
        // @ts-expect-error
        const name = `${uuidv4()}${re.exec(video.name)[0]}`;
        console.log('Name', name);
        // @ts-expect-error
        video.mv(`./uploads/video/${name}`);
        const message = await Message.create({
            to: req.body.to,
            from: req.body.from,
            type: 'video',
            src:`http://45.138.25.10:3000/uploads/video/${name}`,
            date: new Date(),
        })
        observers.map(observer => {
            if (observer.id === message.to?.toString()) {
                observer.call.write(message);
            }
        })
        res.send({src: message.src});
    } catch (err) {
        res.status(500).send(err);
    }
});

uploadRouter.post('/audio', async (req, res) => {
    try {
        if(!req.files) {
            return res.send({
                status: false,
                message: 'No file uploaded'
            });
        }

        let audio = req.files.file;    
        var re = /(?:\.([^.]+))?$/
        // @ts-expect-error
        const name = `${uuidv4()}${re.exec(audio.name)[0]}`;
        console.log('Name', name);
        // @ts-expect-error
        audio.mv(`./uploads/audio/${name}`);
        const message = await Message.create({
            to: req.body.to,
            from: req.body.from,
            type: 'audio',
            src:`http://45.138.25.10:3000/uploads/audio/${name}`,
            date: new Date(),
        })
        observers.map(observer => {
            if (observer.id === message.to?.toString()) {
                observer.call.write(message);
            }
        })
        //send response
        res.send({src: message.src});;        
    } catch (err) {
        console.error('Err', err);
        res.status(500).send(err);
    }
});

export {getMessagesHistory, sendMessage, receiveMessages, uploadRouter};
