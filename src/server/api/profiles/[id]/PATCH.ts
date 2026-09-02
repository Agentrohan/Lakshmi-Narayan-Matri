import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { profiles } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    const update: Partial<typeof profiles.$inferInsert> = {};

    // Admin-only fields (matching / verification)
    if (body.suggestedTo !== undefined) update.suggestedTo = body.suggestedTo as string[];
    if (body.verified !== undefined) update.verified = body.verified as boolean;

    // Editable profile fields
    const textFields = [
      'fullName', 'gender', 'dob', 'birthPlace', 'address',
      'raas', 'gana', 'gotra', 'shakha', 'nakshatra', 'charan', 'naad', 'mangal',
      'diet', 'height', 'weight', 'bloodGroup',
      'education', 'occupation', 'jobLocation', 'income',
      'fatherName', 'fatherDetails', 'motherName', 'motherDetails',
      'siblings', 'maritalStatus', 'vyanga', 'vyangaDetail',
      'partnerExpectations', 'contact1', 'contact2', 'transactionId',
    ] as const;

    for (const field of textFields) {
      if (body[field] !== undefined) {
        (update as Record<string, unknown>)[field] = body[field];
      }
    }

    // Profile photo (base64) — allow updating via edit
    if (body.profilePhotoBase64 !== undefined) {
      update.profilePhotoBase64 = body.profilePhotoBase64 as string;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'Nothing to update' });
    }

    await db.update(profiles).set(update).where(eq(profiles.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/profiles/:id error:', error);
    res.status(500).json({ error: 'Failed to update profile', message: String(error) });
  }
}
