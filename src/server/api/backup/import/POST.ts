import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { profiles, messages } from '../../../db/schema.js';

type BackupRow = Record<string, unknown>;

function isBackupRow(value: unknown): value is BackupRow {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export default async function handler(req: Request, res: Response) {
  try {
    const { profiles: importedProfiles, messages: importedMessages } = req.body as {
      profiles?: unknown;
      messages?: unknown;
    };

    if (!Array.isArray(importedProfiles) || !Array.isArray(importedMessages) || !importedProfiles.every(isBackupRow) || !importedMessages.every(isBackupRow)) {
      return res.status(400).json({ error: 'Invalid backup file. Expected profiles and messages arrays.' });
    }

    const profileRows = importedProfiles.filter((row) => typeof row.id === 'string' && row.id.length > 0);
    const messageRows = importedMessages.filter((row) => typeof row.id === 'string' && row.id.length > 0);

    if (profileRows.length !== importedProfiles.length || messageRows.length !== importedMessages.length) {
      return res.status(400).json({ error: 'Invalid backup file. Every profile and message must include an id.' });
    }

    await db.transaction(async (tx) => {
      await tx.delete(messages);
      await tx.delete(profiles);
      if (profileRows.length > 0) await tx.insert(profiles).values(profileRows as never[]);
      if (messageRows.length > 0) await tx.insert(messages).values(messageRows as never[]);
    });

    res.json({
      success: true,
      profilesRestored: profileRows.length,
      messagesRestored: messageRows.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Import failed', message: String(error) });
  }
}
