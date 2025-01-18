import request from 'supertest';
import app from '../src/app'; // Assuming the app is exported from app.ts
import { query } from '../src/db';

jest.mock('../src/db', () => ({
    query: jest.fn(),
}));

const mockQuery = query as jest.Mock;

describe('Todo API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/todos should return a list of todos', async () => {
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1, title: 'Test Todo', completed: false }],
        });

        const response = await request(app).get('/api/todos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, title: 'Test Todo', completed: false },
        ]);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM todos');
    });

    test('POST /api/todos should create a new todo', async () => {
        const newTodo = { title: 'New Todo', completed: false };
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1, title: 'New Todo', completed: false }],
        });

        const response = await request(app)
            .post('/api/todos')
            .send(newTodo);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 1, title: 'New Todo', completed: false });
        expect(mockQuery).toHaveBeenCalledWith(
            'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
            [newTodo.title, newTodo.completed]
        );
    });

    test('DELETE /api/todos/:id should delete a todo', async () => {
        const todoId = 1; // Use a number for consistency
        mockQuery.mockResolvedValueOnce({});
    
        const response = await request(app).delete(`/api/todos/${todoId}`);
    
        expect(response.status).toBe(204);
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM todos WHERE id = $1', [todoId]);
    });
    
});
