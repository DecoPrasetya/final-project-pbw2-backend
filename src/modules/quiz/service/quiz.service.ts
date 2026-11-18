import { prisma } from '../../../lib/prisma';
import { AppError } from '../../../utils/AppError';
import type {
  CreateQuizPayload,
  SubmitQuizAttemptPayload,
  UpdateQuizPayload,
} from '../quiz';

export class QuizService {
  async create(creatorId: string, payload: CreateQuizPayload) {
    return prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.create({
        data: {
          title: payload.title,
          description: payload.description,
          published: payload.published ?? false,
          creatorId,
        },
      });

      for (const q of payload.questions) {
        const question = await tx.question.create({
          data: {
            quizId: quiz.id,
            questionText: q.questionText,
            order: q.order,
            points: q.points,
          },
        });
        await tx.answerOption.createMany({
          data: q.options.map((o) => ({
            questionId: question.id,
            optionText: o.optionText,
            isCorrect: o.isCorrect,
            order: o.order,
          })),
        });
      }
      return quiz;
    });
  }

  async update(id: string, payload: UpdateQuizPayload) {
    const exists = await prisma.quiz.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'Quiz not found');
    return prisma.quiz.update({
      where: { id },
      data: payload,
      select: { id: true, title: true, published: true, updatedAt: true },
    });
  }

  async remove(id: string) {
    const exists = await prisma.quiz.findUnique({ where: { id } });
    if (!exists) throw new AppError(404, 'Quiz not found');
    await prisma.quiz.delete({ where: { id } });
  }

  async list() {
    return prisma.quiz.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, description: true, createdAt: true,
        _count: { select: { questions: true, attempts: true } },
      },
    });
  }

  async getById(id: string, forAdmin = false) {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: forAdmin
                ? { id: true, optionText: true, order: true, isCorrect: true }
                : { id: true, optionText: true, order: true },
            },
          },
        },
      },
    });
    if (!quiz) throw new AppError(404, 'Quiz not found');
    if (!forAdmin && !quiz.published) throw new AppError(404, 'Quiz not found');
    return quiz;
  }

  async submitAttempt(userId: string, quizId: string, payload: SubmitQuizAttemptPayload) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz || !quiz.published) throw new AppError(404, 'Quiz not found');

    const questionMap = new Map(quiz.questions.map((q) => [q.id, q]));
    let score = 0;
    let totalPoints = 0;

    for (const q of quiz.questions) totalPoints += q.points;

    const normalized: Array<{
      questionId: string;
      answerOptionId: string;
      isCorrect: boolean;
    }> = [];

    for (const ans of payload.answers) {
      const question = questionMap.get(ans.questionId);
      if (!question) throw new AppError(400, `Question ${ans.questionId} not found in quiz`);

      const option = question.options.find((o) => o.id === ans.answerOptionId);
      if (!option) throw new AppError(400, `Option ${ans.answerOptionId} not valid for question`);

      if (option.isCorrect) score += question.points;
      normalized.push({
        questionId: ans.questionId,
        answerOptionId: ans.answerOptionId,
        isCorrect: option.isCorrect,
      });
    }

    const attempt = await prisma.$transaction(async (tx) => {
      const created = await tx.quizAttempt.create({
        data: {
          quizId,
          userId,
          score,
          totalPoints,
          completedAt: new Date(),
        },
      });

      await tx.userAnswer.createMany({
        data: normalized.map((n) => ({
          attemptId: created.id,
          questionId: n.questionId,
          answerOptionId: n.answerOptionId,
          isCorrect: n.isCorrect,
        })),
      });

      return created;
    });

    return {
      attemptId: attempt.id,
      score,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0,
    };
  }

  async listAttemptsByUser(userId: string) {
    return prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      include: { quiz: { select: { id: true, title: true } } },
    });
  }
}

export const quizService = new QuizService();