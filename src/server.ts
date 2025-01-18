import app from './app';
import { Request, Response } from 'express';


const PORT = process.env.PORT || 8081;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to TS To-do List API');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});