"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app")); // Assuming the app is exported from app.ts
const db_1 = require("../src/db");
jest.mock('../src/db', () => ({
    query: jest.fn(),
}));
const mockQuery = db_1.query;
describe('Todo API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('GET /api/todos should return a list of todos', () => __awaiter(void 0, void 0, void 0, function* () {
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1, title: 'Test Todo', completed: false }],
        });
        const response = yield (0, supertest_1.default)(app_1.default).get('/api/todos');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, title: 'Test Todo', completed: false },
        ]);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM todos');
    }));
    test('POST /api/todos should create a new todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const newTodo = { title: 'New Todo', completed: false };
        mockQuery.mockResolvedValueOnce({
            rows: [{ id: 1, title: 'New Todo', completed: false }],
        });
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/api/todos')
            .send(newTodo);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 1, title: 'New Todo', completed: false });
        expect(mockQuery).toHaveBeenCalledWith('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [newTodo.title, newTodo.completed]);
    }));
    test('DELETE /api/todos/:id should delete a todo', () => __awaiter(void 0, void 0, void 0, function* () {
        const todoId = 1; // Use a number for consistency
        mockQuery.mockResolvedValueOnce({});
        const response = yield (0, supertest_1.default)(app_1.default).delete(`/api/todos/${todoId}`);
        expect(response.status).toBe(204);
        expect(mockQuery).toHaveBeenCalledWith('DELETE FROM todos WHERE id = $1', [todoId]);
    }));
});
