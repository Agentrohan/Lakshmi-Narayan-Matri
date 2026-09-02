import type { Request, Response } from 'express';
import { db } from '../../db/client';
import { profiles } from '../../db/schema';
import { sql } from 'drizzle-orm';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB (matches express body limit)

export default async function handler(req: Request, res: Response) {
  const receivedAt = new Date().toISOString();
  const b = req.body as Record<string, string>;

  // Log every incoming submission attempt immediately — before any validation
  // so we always have a trace even if the insert fails
  console.log('profile.submission.received', {
    receivedAt,
    name: b.fullName || '(empty)',
    contact: b.contact1 || '(empty)',
    gender: b.gender || '(empty)',
    hasPhoto: !!b.profilePhotoBase64,
    hasAadhar: !!b.aadharBase64,
    hasPaymentScreenshot: !!b.paymentScreenshotBase64,
    transactionId: b.transactionId || '(empty)',
    payloadBytes: Buffer.byteLength(JSON.stringify(req.body), 'utf-8'),
  });

  try {
    const bodyStr = JSON.stringify(req.body);
    if (Buffer.byteLength(bodyStr, 'utf-8') > MAX_BYTES) {
      console.warn('profile.submission.too_large', {
        receivedAt,
        name: b.fullName,
        bytes: Buffer.byteLength(bodyStr, 'utf-8'),
      });
      return res.status(413).json({
        error: 'Payload too large',
        message: 'Your submission exceeds the 10 MB limit. Please use a smaller photo or Aadhar image (compress to under 2 MB each) and try again.',
      });
    }

    // Get next profile number
    const countResult = await db.select({ count: sql<number>`COUNT(*)` }).from(profiles);
    const profileNumber = Number(countResult[0]?.count ?? 0) + 1;

    const id = `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    await db.insert(profiles).values({
      id,
      profileNumber,
      iqCode: String(profileNumber),
      fullName:            b.fullName            || null,
      gender:              b.gender              || null,
      dob:                 b.dob                 || null,
      birthPlace:          b.birthPlace          || null,
      address:             b.address             || null,
      raas:                b.raas                || null,
      gana:                b.gana                || null,
      gotra:               b.gotra               || null,
      shakha:              b.shakha              || null,
      nakshatra:           b.nakshatra           || null,
      charan:              b.charan              || null,
      naad:                b.naad                || null,
      mangal:              b.mangal              || null,
      diet:                b.diet                || null,
      height:              b.height              || null,
      weight:              b.weight              || null,
      bloodGroup:          b.bloodGroup          || null,
      education:           b.education           || null,
      occupation:          b.occupation          || null,
      jobLocation:         b.jobLocation         || null,
      income:              b.income              || null,
      fatherName:          b.fatherName          || null,
      fatherDetails:       b.fatherDetails       || null,
      motherName:          b.motherName          || null,
      motherDetails:       b.motherDetails       || null,
      siblings:            b.siblings            || null,
      maritalStatus:       b.maritalStatus       || null,
      vyanga:              b.vyanga              || null,
      vyangaDetail:        b.vyangaDetail        || null,
      partnerExpectations: b.partnerExpectations || null,
      contact1:            b.contact1            || null,
      contact2:            b.contact2            || null,
      transactionId:       b.transactionId       || null,
      profilePhotoBase64:  b.profilePhotoBase64  || null,
      aadharBase64:        b.aadharBase64        || null,
      paymentScreenshotBase64: b.paymentScreenshotBase64 || null,
      verified:            false,
      suggestedTo:         [],
    });

    console.log('profile.submission.saved', {
      id,
      profileNumber,
      name: b.fullName,
      savedAt: new Date().toISOString(),
    });

    res.status(201).json({ success: true, id, profileNumber });
  } catch (error) {
    console.error('profile.submission.failed', {
      receivedAt,
      name: b.fullName || '(empty)',
      contact: b.contact1 || '(empty)',
      error: String(error),
    });
    res.status(500).json({ error: 'Failed to save profile', message: String(error) });
  }
}
