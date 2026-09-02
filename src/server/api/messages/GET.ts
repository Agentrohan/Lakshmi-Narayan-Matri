import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { messages } from '../../db/schema';
import { desc } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const rows = await db.select().from(messages).orderBy(desc(messages.sentAt));
    const result = rows.map(r => ({
      ...r,
      sentAt: r.sentAt ? r.sentAt.toISOString() : null,
    }));
    res.json(result);
  } catch (error) {
    console.error('GET /api/messages error:', error);
    res.status(500).json({ error: 'Failed to load messages', message: String(error) });
  }
}
