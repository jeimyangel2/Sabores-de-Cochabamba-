import { Router, Request, Response } from 'express';
import { getDatabaseStatus } from '../config/db.ts';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const status = getDatabaseStatus();
  res.json(status);
});

export default router;
