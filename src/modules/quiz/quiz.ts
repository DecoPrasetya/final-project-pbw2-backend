import { z } from 'zod';

const OptionInputSchema = z.object({
  optionText: z.string('Option text must be a string').trim().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
  order: z.coerce.number().int().min(0).default(0),
});

const QuestionInputSchema = z.object({
  questionText: z.string('Question text must be a string').trim().min(1, 'Question text is required'),
  order: z.coerce.number().int().min(0).default(0),
  points: z.coerce.number().int().min(1).default(1),
  options: z
    .array(OptionInputSchema)
    .min(2, 'At least 2 options are required')
    .max(6, 'At most 6 options are allowed')
    .refine(
      (opts) => opts.filter((o) => o.isCorrect).length === 1,
      'Exactly one option must be marked as correct'
    ),
});

export const CreateQuizParamsSchema = z.object({
  title: z.string('Title must be a string').trim().min(1).max(200),
  description: z.string().trim().max(1000).optional(),
  published: z.boolean().optional(),
  questions: z.array(QuestionInputSchema).min(1, 'At least one question is required'),
});
export type CreateQuizPayload = z.infer<typeof CreateQuizParamsSchema>;

export const UpdateQuizParamsSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  published: z.boolean().optional(),
});
export type UpdateQuizPayload = z.infer<typeof UpdateQuizParamsSchema>;

export const SubmitQuizAttemptParamsSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, 'Question id is required'),
        answerOptionId: z.string().min(1, 'Answer option id is required'),
      })
    )
    .min(1, 'At least one answer is required'),
});
export type SubmitQuizAttemptPayload = z.infer<typeof SubmitQuizAttemptParamsSchema>;