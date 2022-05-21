import { getClient } from "backend/config/redis";
import { addToAnswer } from "backend/services/answer";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const redis = await getClient();
  if (req.method === "PATCH") {
    const { word, version } = req.body;
    const answer = await redis.get("answer");
    if (answer != null && answer.length !== version) {
      return res.status(409).json({ answer });
    }
    const usersAnswer = answer == null ? word : `${answer} ${word}`;
    console.log(word, answer)
    console.log('user', usersAnswer)
    const question = await redis.get("question");
    if (!question) {
      throw new Error("Need question");
    }
    const data = await addToAnswer(question, usersAnswer);
    console.log(data);
    await redis.set("answer", data.answer);
    return res.json(data);
  }
}
