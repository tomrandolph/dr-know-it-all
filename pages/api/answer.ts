import { getClient } from "backend/config/redis";
import { addToAnswer } from "backend/services/answer";
import { Logger } from "common/logger";
import { NextApiRequest, NextApiResponse } from "next";

// Adds a global rate limit to prevent burning too much usage on openAI
async function rateLimit(time: number): Promise<boolean> {
  const redis = await getClient();
  const tooSoon = Boolean(await redis.get("limit"));
  if (tooSoon) {
    return false;
  }
  await redis.setEx("limit", time, "true");

  return true;
}

export default async function handleAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const redis = await getClient();
  if (req.method === "PATCH") {
    const { word, version } = req.body;
    const answer = await redis.get("answer");
    if (answer != null && answer.length !== version) {
      return res.status(409).json({ answer });
    }
    const usersAnswer = answer == null ? word : `${answer} ${word}`;
    Logger.log(word, answer);
    Logger.log("user", usersAnswer);
    const canMakeRequest = await rateLimit(5);
    if (!canMakeRequest) {
      Logger.log("limiting");
      await redis.set("answer", usersAnswer);
      return res.json({ answer: usersAnswer });
    }
    const question = await redis.get("question");
    if (!question) {
      throw new Error("Need question");
    }
    const data = await addToAnswer(question, usersAnswer);
    Logger.log(data);
    await redis.set("answer", data.answer);
    return res.json(data);
  }
}
