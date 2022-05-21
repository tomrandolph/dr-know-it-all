export const useAskQuestion = () => {
  const ask = async (question: string) => {
    return fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  };
  return ask;
};
