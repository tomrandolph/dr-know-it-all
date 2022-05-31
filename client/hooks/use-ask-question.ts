import { addDoc, collection, Timestamp } from "firebase/firestore";
import { firestore, questionConverter } from "common/config/firebase";

export const useAskQuestion = () => {
  const ask = (question: string) =>
    addDoc(
      collection(firestore, "/questions").withConverter(questionConverter),
      // defaults should be handled by data converter but tend to make TS unhappy
      { question, answers: [], created: Timestamp.now() }
    );
  return { ask };
};
