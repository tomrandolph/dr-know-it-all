import { computAnswer } from "backend/services/answer";
import { Logger } from "common/logger";
import {
  addToAnswer,
  aiLastAnsweredAt,
  formatAnswer,
  getQuestion,
} from "common/services/question";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const questionId = req.query.id as string;
  if (req.method === "GET") {
    return res.json({ questionId });
  }
  if (req.method === "POST") {
    const doc = await getQuestion(req.query.id);
    const question = doc.data();
    if (!doc.exists() || question == null) {
      return res.status(404).json({ error: "Question does not exist" });
    }
    if (Number(Date.now()) < aiLastAnsweredAt(doc) + 1000) {
      Logger.log("too recent request");
      return res.end();
    }
    const { answers } = question;
    const formatted = formatAnswer(answers);
    const aiAnswer = await computAnswer(question.question, formatted);
    await addToAnswer(questionId, aiAnswer);
    return res.json(aiAnswer);
  }
}
