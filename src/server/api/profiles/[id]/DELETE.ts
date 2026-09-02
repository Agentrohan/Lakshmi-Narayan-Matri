import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { profiles } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const result = await db.delete(profiles).where(eq(profiles.id, req.params.id));
    const affected = (result as unknown as [{ affectedRows: number }])[0]?.affectedRows ?? 0;
    if (affected === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/profiles/:id error:', error);
    res.status(500).json({ error: 'Failed to delete profile', message: String(error) });
  }
}
