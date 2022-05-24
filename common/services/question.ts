import {
  arrayUnion,
  doc,
  DocumentSnapshot,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { collection, orderBy, limit, query, getDocs } from "firebase/firestore";

import {
  questionConverter,
  firestore,
  Answer,
  QuestionDoc,
} from "common/config/firebase";

export const latestQuestion = async () => {
  const questions = collection(firestore, "/questions").withConverter(
    questionConverter
  );
  return getDocs(query(questions, orderBy("created", "desc"), limit(1)));
};

export const getQuestion = async (id) => {
  const question = doc(firestore, `/questions/${id}`).withConverter(
    questionConverter
  );
  return getDoc(question);
};

export const addToAnswer = (questionId: string, answer: Answer) => {
  return updateDoc(
    doc(firestore, `questions/${questionId}`).withConverter(questionConverter),
    "answers",
    //  each answer must be unique
    // arrayUnion will de-dupe otherwise
    arrayUnion(answer)
  );
};

export const formatAnswer = (answers: Answer[]): string => {
  const answerParts: string[] = [];
  for (const answer of answers) {
    if (answer.spaceBefore === true) {
      answerParts.push(" ");
    }
    answerParts.push(answer.answer);
  }
  return answerParts.join("");
};

export const aiLastAnsweredAt = (doc: DocumentSnapshot<QuestionDoc>) => {
  const times = doc
    .data()
    ?.answers.filter((answer) => answer.addedBy === "openai")
    .map((answer) => answer.addedAt.toMillis()) ?? [0];
  return Math.max(...times);
};
