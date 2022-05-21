import { useMutation, useQuery, useQueryClient } from "react-query";
const askQuestion = async (askedQuestion: string): Promise<string> => {
  const res = await fetch("/api/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ askedQuestion }),
  });
  const { question } = await res.json();
  return question;
};

const getQuestion = async () => {
  const data = await fetch("/api/question");
  const { question } = await data.json();
  return question;
};

export const useGetQuestion = () => useQuery(["question"], getQuestion);

export const useAksQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(askQuestion, {
    onSuccess: () => queryClient.invalidateQueries(["question", "answer"]),
  });
};

export const useAnswerQuestion = (existingAnswer) =>
  useMutation(async (word) => {
    const version = existingAnswer?.length ?? 0;
    const res = await fetch("/api/answer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, version }),
    });
    const { answer } = await res.json();
    return answer;
  });
