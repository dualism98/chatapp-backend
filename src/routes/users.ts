import express from 'express';
import authMiddleware from '../middlewares/auth';
import Message from '../models/Message';
import User from '../models/User';

const router = express.Router();

router.post('/', async (req, res) => {
    const user = {
        name: req.body.name,
    }

    const createdUser = await User.create(user);

    res.send(createdUser.toJSON());
})

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.headers.authorization;
    let users:any = await User.find({'_id': {'$ne': userId}})
    for (let i = 0; i < users.length; i++) {
        const lastMessage = (await Message.findOne({to: {$in: [userId, users[i]._id]}}, {}, {sort: {'date': -1}})) ?? null;
        users[i]._doc.lastMessage = lastMessage
    }

    res.send(users);
})

export default router;