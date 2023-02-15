import Message from '../models/Message';
import User from '../models/User';

// @ts-expect-error
const createUser = async (call, callback) => {
    console.log('User creation request, name')
    const {name} = call.request;
    const user = await User.create({name});
    callback(null, user)
}

// @ts-expect-error
const getAllChats = async (call, callback) => {
    const {userId} = call.request;
    const user = await User.findById(userId);

    if (!user) {
        return callback(null, {users: []});
    }

    let chats = await User.find({'_id': {'$ne': userId}})
    for (let i = 0; i < chats.length; i++) {
        const lastMessage = (await Message.findOne({to: {$in: [userId, chats[i]._id]}}, {}, {sort: {'date': -1}})) ?? null;
        // @ts-expect-error
        chats[i]._doc.lastMessage = lastMessage
    }

    callback(null, { chats });
  };

export {createUser, getAllChats};