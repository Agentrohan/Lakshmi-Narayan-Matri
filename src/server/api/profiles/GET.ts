import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { profiles } from '../../db/schema';
import { asc } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const rows = await db.select().from(profiles).orderBy(asc(profiles.profileNumber));
    // Normalise to the shape the frontend expects
    const result = rows.map(r => ({
      ...r,
      suggestedTo: Array.isArray(r.suggestedTo) ? r.suggestedTo : [],
      submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
    }));
    res.json(result);
  } catch (error) {
    console.error('GET /api/profiles error:', error);
    res.status(500).json({ error: 'Failed to load profiles', message: String(error) });
  }
}
