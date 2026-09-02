import type { Request, Response } from 'express';
import { db } from '../../../db/client';
import { profiles, messages } from '../../../db/schema';
import { desc, sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  // Simple admin auth check
  const auth = req.headers['x-admin-token'];
  if (auth !== 'lnm-admin-2024') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    serverUptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  // DB connection test
  try {
    await db.execute(sql`SELECT 1`);
    report.dbStatus = 'connected';
  } catch (err) {
    report.dbStatus = 'error';
    report.dbError = String(err);
  }

  // Profile count
  try {
    const countResult = await db.select({ count: sql<number>`COUNT(*)` }).from(profiles);
    report.profileCount = Number(countResult[0]?.count ?? 0);
  } catch (err) {
    report.profileCount = null;
    report.profileCountError = String(err);
  }

  // Message count
  try {
    const countResult = await db.select({ count: sql<number>`COUNT(*)` }).from(messages);
    report.messageCount = Number(countResult[0]?.count ?? 0);
  } catch (err) {
    report.messageCount = null;
  }

  // Last 10 submissions (no photos — just metadata)
  try {
    const recent = await db
      .select({
        id: profiles.id,
        profileNumber: profiles.profileNumber,
        fullName: profiles.fullName,
        gender: profiles.gender,
        contact1: profiles.contact1,
        submittedAt: profiles.submittedAt,
        transactionId: profiles.transactionId,
        verified: profiles.verified,
        hasPhoto: sql<number>`CASE WHEN profile_photo_base64 IS NOT NULL AND profile_photo_base64 != '' THEN 1 ELSE 0 END`,
        hasAadhar: sql<number>`CASE WHEN aadhar_base64 IS NOT NULL AND aadhar_base64 != '' THEN 1 ELSE 0 END`,
        hasPaymentScreenshot: sql<number>`CASE WHEN payment_screenshot_base64 IS NOT NULL AND payment_screenshot_base64 != '' THEN 1 ELSE 0 END`,
      })
      .from(profiles)
      .orderBy(desc(profiles.submittedAt))
      .limit(10);

    report.recentSubmissions = recent.map(r => ({
      ...r,
      submittedAt: r.submittedAt ? r.submittedAt.toISOString() : null,
      hasPhoto: Boolean(r.hasPhoto),
      hasAadhar: Boolean(r.hasAadhar),
      hasPaymentScreenshot: Boolean(r.hasPaymentScreenshot),
    }));
  } catch (err) {
    report.recentSubmissions = [];
    report.recentSubmissionsError = String(err);
  }

  // Check for profiles missing critical fields
  try {
    const incomplete = await db
      .select({
        id: profiles.id,
        profileNumber: profiles.profileNumber,
        fullName: profiles.fullName,
        submittedAt: profiles.submittedAt,
        missingName: sql<number>`CASE WHEN full_name IS NULL OR full_name = '' THEN 1 ELSE 0 END`,
        missingContact: sql<number>`CASE WHEN contact1 IS NULL OR contact1 = '' THEN 1 ELSE 0 END`,
        missingTransaction: sql<number>`CASE WHEN transaction_id IS NULL OR transaction_id = '' THEN 1 ELSE 0 END`,
        missingPaymentScreenshot: sql<number>`CASE WHEN payment_screenshot_base64 IS NULL OR payment_screenshot_base64 = '' THEN 1 ELSE 0 END`,
      })
      .from(profiles)
      .orderBy(desc(profiles.submittedAt))
      .limit(50);

    report.integrityCheck = {
      total: incomplete.length,
      missingName: incomplete.filter(r => r.missingName).length,
      missingContact: incomplete.filter(r => r.missingContact).length,
      missingTransaction: incomplete.filter(r => r.missingTransaction).length,
      missingPaymentScreenshot: incomplete.filter(r => r.missingPaymentScreenshot).length,
    };
  } catch (err) {
    report.integrityCheck = null;
  }

  res.json(report);
}
