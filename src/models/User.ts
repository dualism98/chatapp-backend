import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        required: false,
    },
    name: String,
});

export default mongoose.model('User', userSchema);