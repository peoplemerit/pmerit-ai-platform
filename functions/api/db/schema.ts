/**
 * Drizzle ORM Schema Definition
 * Defines the database tables for type-safe queries
 * 
 * @created November 10, 2025
 * @version 1.0.0
 */

import { pgTable, serial, uuid, integer, jsonb, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * Assessment Sessions Table
 * Stores user assessment progress and answers
 */
export const assessmentSessions = pgTable('assessment_sessions', {
  id: serial('id').primaryKey(),
  sessionId: uuid('session_id').notNull(),
  userId: integer('user_id'),
  consentData: jsonb('consent_data').notNull(),
  currentQuestion: integer('current_question').notNull(),
  answers: jsonb('answers'),
  status: varchar('status', { length: 50 }).notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});

/**
 * Assessment Results Table
 * Stores completed assessment results and career matches
 */
export const assessmentResults = pgTable('assessment_results', {
  id: serial('id').primaryKey(),
  resultId: uuid('result_id').notNull(),
  sessionId: uuid('session_id').notNull(),
  userId: integer('user_id'),
  bigFive: jsonb('big_five').notNull(),
  hollandCode: varchar('holland_code', { length: 10 }).notNull(),
  careerMatches: jsonb('career_matches').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});