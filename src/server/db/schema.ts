import {
  mysqlTable,
  int,
  varchar,
  text,
  mediumtext,
  boolean,
  timestamp,
  json,
} from 'drizzle-orm/mysql-core';

// ── Matrimonial Profiles ──────────────────────────────────────────────────────
export const profiles = mysqlTable('profiles', {
  id:               varchar('id', { length: 64 }).primaryKey(),
  profileNumber:    int('profile_number').notNull(),
  submittedAt:      timestamp('submitted_at').defaultNow(),

  // Personal
  fullName:         varchar('full_name', { length: 255 }),
  gender:           varchar('gender', { length: 16 }),
  dob:              varchar('dob', { length: 32 }),
  birthPlace:       varchar('birth_place', { length: 255 }),
  address:          text('address'),

  // Astrology
  raas:             varchar('raas', { length: 64 }),
  gana:             varchar('gana', { length: 64 }),
  gotra:            varchar('gotra', { length: 128 }),
  shakha:           varchar('shakha', { length: 128 }),
  nakshatra:        varchar('nakshatra', { length: 64 }),
  charan:           varchar('charan', { length: 64 }),
  naad:             varchar('naad', { length: 64 }),
  mangal:           varchar('mangal', { length: 16 }),

  // Physical
  diet:             varchar('diet', { length: 64 }),
  height:           varchar('height', { length: 32 }),
  weight:           varchar('weight', { length: 32 }),
  bloodGroup:       varchar('blood_group', { length: 8 }),

  // Education & Occupation
  education:        text('education'),
  occupation:       text('occupation'),
  jobLocation:      text('job_location'),
  income:           varchar('income', { length: 128 }),

  // Family
  fatherName:       varchar('father_name', { length: 255 }),
  fatherDetails:    text('father_details'),
  motherName:       varchar('mother_name', { length: 255 }),
  motherDetails:    text('mother_details'),
  siblings:         text('siblings'),
  maritalStatus:    varchar('marital_status', { length: 64 }),
  vyanga:           varchar('vyanga', { length: 8 }),
  vyangaDetail:     text('vyanga_detail'),

  // Partner Expectations
  partnerExpectations: text('partner_expectations'),
  contact1:         varchar('contact1', { length: 32 }),
  contact2:         varchar('contact2', { length: 32 }),

  // Payment
  transactionId:    varchar('transaction_id', { length: 128 }),

  // Images (base64 — mediumtext holds up to 16 MB, enough for compressed photos)
  profilePhotoBase64: mediumtext('profile_photo_base64'),
  aadharBase64:     mediumtext('aadhar_base64'),
  paymentScreenshotBase64: mediumtext('payment_screenshot_base64'),

  // Admin fields
  iqCode:           varchar('iq_code', { length: 16 }),
  verified:         boolean('verified').default(false),
  suggestedTo:      json('suggested_to').$type<string[]>().default([]),
});

// ── Contact Messages ──────────────────────────────────────────────────────────
export const messages = mysqlTable('messages', {
  id:        varchar('id', { length: 64 }).primaryKey(),
  sentAt:    timestamp('sent_at').defaultNow(),
  read:      boolean('read').default(false),
  name:      varchar('name', { length: 255 }),
  phone:     varchar('phone', { length: 32 }),
  email:     varchar('email', { length: 255 }),
  message:   text('message'),
});
