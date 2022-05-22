import { getClient } from "backend/config/redis";
import { Logger } from "common/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handleQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const redis = await getClient();
  if (req.method === "POST") {
    const { question } = req.body;
    Logger.log("question", question);
    await redis.set("question", question);
    await redis.del("answer");
    return res.json({ question });
  }
  if (req.method === "GET") {
    const question = await redis.get("question");
    return res.json({ question });
  }
}
