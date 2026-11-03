import { z } from 'zod';

/**
 * Zod schema for exam creation request payload.
 */
export const createExamSchema = z.object({
  title: z.string().min(3, 'Exam title must be at least 3 characters long'),
  durationMinutes: z.coerce.number().int().min(1).max(600).default(60),
  scheduledStartTime: z.string().datetime().nullable().optional(),
  rawText: z.string().min(10, 'Exam question text cannot be empty')
});

/**
 * Zod schema for exam update payload.
 */
export const updateExamStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'])
});

/**
 * Zod schema for candidate registration / session initiation.
 */
export const registerCandidateSchema = z.object({
  candidateName: z.string().trim().min(2, 'Candidate name must be at least 2 characters'),
  candidateEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  peerId: z.string().optional()
});

/**
 * Zod schema for logging proctoring integrity violations.
 */
export const logViolationSchema = z.object({
  violationType: z.enum([
    'TAB_SWITCH',
    'WINDOW_BLUR',
    'MULTIPLE_PEOPLE',
    'NO_FACE_DETECTED',
    'CAMERA_MUTED',
    'FULLSCREEN_EXIT',
    'DEVTOOLS_OPEN'
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  details: z.string().max(1000).optional()
});

/**
 * Zod schema for saving an answer selection.
 */
export const submitAnswerSchema = z.object({
  questionId: z.string().uuid('Invalid question ID format'),
  selectedOptionIndex: z.number().int().min(0).max(10).nullable()
});

/**
 * Zod schema for candidate final submission.
 */
export const finalizeSubmissionSchema = z.object({
  answers: z.record(z.string().uuid(), z.number().int().min(0).max(10)).optional()
});

