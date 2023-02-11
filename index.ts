import mongoose from "mongoose";
import express from 'express';
import bodyParser from 'body-parser';
require('dotenv').config()

import userRouter from './src/routes/users';
import messageRouter from './src/routes/messages';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/message', messageRouter)

app.get('/', (req, res) => {
    res.send('Hello world!');
})

mongoose
 .connect(
    `mongodb+srv://${
        process.env.DATABASE_NICKNAME
    }:${
        process.env.DATABASE_PASSWORD
    }@chatapp.ikng7rb.mongodb.net/?retryWrites=true&w=majority`
)

app.listen(port);