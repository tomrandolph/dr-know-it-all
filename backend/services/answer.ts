import { openai } from "backend/config/openai";
import { Logger } from "common/logger";

interface AnswerData {
  done: boolean;
  answer: string;
}
export async function addToAnswer(
  question: string,
  existingAnswer: string
): Promise<AnswerData> {
  const prompt = `Provide a silly answer to the following question: ${question}
${existingAnswer}`;
  const { data: completion } = await openai.createCompletion(
    "text-davinci-002",
    {
      prompt,
      max_tokens: 2,
      temperature: 0.8,
    }
  );
  Logger.log(prompt);
  Logger.log(completion);
  const choice = completion.choices?.[0];
  if (choice == null) {
    return { answer: existingAnswer, done: true };
  }
  const trimmedComputedAnswer = choice.text
    ?.replace("\n\n", ".")
    .trim()
    .split(" ")[0];
  Logger.log("trimmed", trimmedComputedAnswer);
  return {
    answer: `${existingAnswer} ${trimmedComputedAnswer}`,
    done: false,
  };
}
