import { openai } from "backend/config/openai";
import { Logger } from "common/logger";
import { Answer } from "common/config/firebase";
import { Timestamp } from "firebase/firestore";
export async function computAnswer(
  question: string,
  existingAnswer: string
): Promise<Answer> {
  const prompt = `Provide a silly answer to the following question: ${question}
${existingAnswer}`;
  const { data: completion } = await openai.createCompletion(
    "text-davinci-002",
    {
      prompt,
      max_tokens: 2,
      temperature: 1,
    }
  );
  Logger.log(prompt);
  Logger.log(completion);
  const choice = completion.choices?.[0];
  if (choice?.text == null) {
    return {
      spaceBefore: false,
      answer: ".",
      addedAt: Timestamp.now(),
      addedBy: "openai",
    };
  }
  const formatted = choice.text.replace("\n\n", ".");
  const trimmed = formatted.trimStart();
  const splits = trimmed.split(" ");
  let [word] = splits;
  if (word === ".") {
    word = trimmed;
  }
  Logger.log("computed", word);
  return {
    answer: word,
    addedBy: "openai",
    addedAt: Timestamp.now(),
    spaceBefore: trimmed.length < formatted.length,
  };
}
