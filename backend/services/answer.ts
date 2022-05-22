import { openai } from "backend/config/openai";

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
  console.log(prompt);
  console.log(completion);
  const choice = completion.choices?.[0];
  if (choice == null) {
    return { answer: existingAnswer, done: true };
  }
  const trimmedComputedAnswer = choice.text
    ?.replace("\n\n", ".")
    .trim()
    .split(" ")[0];
  console.log("trimmed", trimmedComputedAnswer);
  return {
    answer: `${existingAnswer} ${trimmedComputedAnswer}`,
    done: false,
  };
}
