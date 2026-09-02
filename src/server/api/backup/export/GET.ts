import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { profiles, messages } from '../../../db/schema.js';

export default async function handler(_req: Request, res: Response) {
  try {
    const [profileRows, messageRows] = await Promise.all([
      db.select().from(profiles),
      db.select().from(messages),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: 2,
      profiles: profileRows,
      messages: messageRows,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="LNM-Complete-Backup-${new Date().toISOString().slice(0, 10)}.json"`,
    );
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: 'Export failed', message: String(error) });
  }
}
