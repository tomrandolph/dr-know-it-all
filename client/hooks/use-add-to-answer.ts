import { Timestamp } from "firebase/firestore";
import type { Answer } from "common/config/firebase";
import { addToAnswer } from "common/services/question";

export const useAddToAnswer = (questionId?: string, username?: string) => {
  const add = (answerText: string) => {
    const answer: Answer = {
      answer: answerText,
      addedAt: Timestamp.now(),
      // TODO integrate with auth to get added by
      addedBy: username ?? "unknown",
      spaceBefore: true,
    };
    // todo handle this better
    if (!questionId) {
      return;
    }
    return addToAnswer(questionId, answer);
  };

  const compute = () =>
    fetch(`/api/questions/${questionId}/answer`, { method: "POST" });
  return { add, compute };
};
