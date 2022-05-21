export const useQuestion = () => {
  const ask = async (askedQuestion: string): Promise<string> => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: askedQuestion }),
    });
    const { question } = await res.json();
    return question;
  };

  const get = async () => {
    const data = await fetch("/api/question");
    const { question } = await data.json();
    return question;
  };

  const answer = async (existingAnswer: string | null, word: string) => {
    const version = existingAnswer?.length ?? 0;
    const res = await fetch("/api/answer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word, version }),
    });
    const { answer } = await res.json();
    return answer;
  };

  return { ask, get, answer };
};
