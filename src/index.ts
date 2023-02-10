import mongoose from "mongoose";
require('dotenv').config()

mongoose
 .connect(
    `mongodb+srv://${
        process.env.DATABASE_NICKNAME
    }:${
        process.env.DATABASE_PASSWORD
    }@chatapp.ikng7rb.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => console.log('Connected to database'));

