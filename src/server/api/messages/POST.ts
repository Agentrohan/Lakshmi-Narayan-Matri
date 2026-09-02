import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { messages } from '../../db/schema';

export default async function handler(req: Request, res: Response) {
  try {
    const b = req.body as Record<string, string>;
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await db.insert(messages).values({
      id,
      read: false,
      name:    b.name    || null,
      phone:   b.phone   || null,
      email:   b.email   || null,
      message: b.message || null,
    });

    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    res.status(500).json({ error: 'Failed to save message', message: String(error) });
  }
}
