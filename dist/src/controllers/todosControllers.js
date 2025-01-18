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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodos = void 0;
const zod_1 = require("zod");
const db_1 = require("../db");
const utilities_1 = require("../utilities");
const TodoSchema = zod_1.z.object({
    title: zod_1.z.string(),
    completed: zod_1.z.boolean().default(false),
});
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.query)('SELECT * FROM todos');
    res.json(result.rows);
});
exports.getTodos = getTodos;
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = TodoSchema.parse(req.body);
        const result = yield (0, db_1.query)('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [data.title, data.completed]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (res instanceof require('express').response.constructor) {
            (0, utilities_1.handleError)(error, res);
        }
        else {
            console.error('Invalid Response object passed.');
        }
    }
});
exports.addTodo = addTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('update Todo called');
    try {
        const id = parseInt(req.params.id, 10); // Extract the ID from the route params
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const fields = req.body;
        // Validate that the request body is not empty
        if (!fields || Object.keys(fields).length === 0) {
            return res.status(400).json({ error: 'No fields provided for update.' });
        }
        // Build dynamic query
        const updates = [];
        const values = [];
        Object.entries(fields).forEach(([key, value], index) => {
            updates.push(`${key} = $${index + 1}`); // Add dynamic field for each key
            values.push(value);
        });
        values.push(id); // Add the ID as the last parameter
        const queryText = `
      UPDATE todos
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;
        const result = yield (0, db_1.query)(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        // Return the updated todo
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        if (res instanceof require('express').response.constructor) {
            (0, utilities_1.handleError)(error, res);
        }
        else {
            console.error('Invalid Response object passed.');
        }
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        yield (0, db_1.query)('DELETE FROM todos WHERE id = $1', [id]);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTodo = deleteTodo;
