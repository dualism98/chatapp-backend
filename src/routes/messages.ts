import express from 'express';
import authMiddleware from '../middlewares/auth';
import Message from '../models/Message';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.headers.authorization;
    const {from} = req.query;
    const messages = await Message.find({from: {$in: [userId, from]}}, {}, {sort: {'date': -1}});
    res.send(messages);
});

router.post('/', authMiddleware, async (req, res) => {
    const userId = req.headers.authorization;
    const {text, to, type} = req.body;
    await Message.create({
        from: userId,
        text,
        type,
        to,
        date: new Date(),
    })
    res.sendStatus(201);
});

export default router;