import { openai } from "backend/config/openai";
import { Logger } from "common/logger";
<<<<<<< HEAD
import { Answer } from "common/config/firebase";
import { Timestamp } from "firebase/firestore";
export async function computAnswer(
  question: string,
  existingAnswer: string
): Promise<Answer> {
=======

export async function addToAnswer(
  question: string,
  existingAnswer: string
): Promise<string> {
>>>>>>> 754d5b7... prompt name, set cookie
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
<<<<<<< HEAD
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
=======
  if (choice == null) {
    return existingAnswer;
  }
  const trimmedComputedAnswer = choice.text
    ?.replace("\n\n", ".")
    .trim()
    .split(" ")[0];
  Logger.log("trimmed", trimmedComputedAnswer);
  return `${existingAnswer} ${trimmedComputedAnswer}`;
>>>>>>> 754d5b7... prompt name, set cookie
}
