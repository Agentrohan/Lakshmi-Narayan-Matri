import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = '/shared-storage/public/assets/uploads/profiles';

export default async function handler(req: Request, res: Response) {
  try {
    // Expect base64 body: { base64: "data:image/jpeg;base64,...", filename: "photo.jpg" }
    const { base64, filename } = req.body as { base64: string; filename: string };
    if (!base64 || !filename) {
      return res.status(400).json({ error: 'Missing base64 or filename' });
    }

    // Strip data URL prefix
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Invalid base64 format' });
    const buffer = Buffer.from(matches[2], 'base64');

    // Sanitise filename and make unique
    const ext = path.extname(filename).toLowerCase() || '.jpg';
    const safeName = `profile_${Date.now()}_${Math.random().toString(36).slice(2, 6)}${ext}`;

    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);

    res.json({ url: `/airo-assets/uploads/profiles/${safeName}` });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', message: String(error) });
  }
}
