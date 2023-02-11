import mongoose, { SchemaTypes } from "mongoose";

const messageSchema = new mongoose.Schema({
    from: SchemaTypes.ObjectId,
    to: SchemaTypes.ObjectId,
    type: String,
    src: {
        type: String,
        required: false,
    },
    text: {
        type: String,
        required: false,
    },
    date: Date,
})

export default mongoose.model('Message', messageSchema);