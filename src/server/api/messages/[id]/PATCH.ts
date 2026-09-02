import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { messages } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { read } = req.body as { read?: boolean };
    if (read !== undefined) {
      await db.update(messages).set({ read }).where(eq(messages.id, req.params.id));
    }
    res.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/messages/:id error:', error);
    res.status(500).json({ error: 'Failed to update message', message: String(error) });
  }
}
