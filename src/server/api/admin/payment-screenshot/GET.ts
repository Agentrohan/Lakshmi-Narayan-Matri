import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { profiles } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const auth = req.headers['x-admin-token'];
  if (auth !== 'lnm-admin-2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing profile id' });

  try {
    const rows = await db
      .select({
        fullName: profiles.fullName,
        paymentScreenshotBase64: profiles.paymentScreenshotBase64,
        transactionId: profiles.transactionId,
      })
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);

    if (!rows.length) return res.status(404).json({ error: 'Profile not found' });

    const row = rows[0];
    res.json({
      fullName: row.fullName,
      transactionId: row.transactionId,
      paymentScreenshotBase64: row.paymentScreenshotBase64 || null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch screenshot', message: String(err) });
  }
}
