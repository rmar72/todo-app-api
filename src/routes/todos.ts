import { Router } from 'express';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../controllers/todosControllers';

const router = Router();

router.get('/', getTodos)
router.post('/', addTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router;