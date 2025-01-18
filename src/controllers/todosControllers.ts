import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { handleError } from '../utilities'

const TodoSchema = z.object({
  title: z.string(),
  completed: z.boolean().default(false),
})

export const getTodos = async (req: Request, res: Response) => {
  const result = await query('SELECT * FROM todos');
  res.json(result.rows);
};

export const addTodo = async (req: Request, res: Response) => {
  try {
    const data = TodoSchema.parse(req.body);
    const result = await query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', [data.title, data.completed])
    res.status(201).json(result.rows[0])
  } catch (error) {
    if (res instanceof require('express').response.constructor) {
        handleError(error, res);
    } else {
        console.error('Invalid Response object passed.');
    }
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<any | void>  => {
  console.log('update Todo called')
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
    const updates: string[] = [];
    const values: any[] = [];

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

    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Return the updated todo
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (res instanceof require('express').response.constructor) {
      handleError(error, res);
    } else {
      console.error('Invalid Response object passed.');
    }
  }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<any | void> => {
  try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      await query('DELETE FROM todos WHERE id = $1', [id]);
      res.status(204).send();
  } catch (error) {
      next(error);
  }
};