import { Router } from 'express';
import { getConversations, createConversation, getMessages, sendMessage } from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

export default router;
