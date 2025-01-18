import { Response } from 'express';

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
      res.status(400).json({ error: error.message });
  } else {
      res.status(400).json({ error: 'An unknown error occurred' });
  }
};