import type { QuerySnapshot } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import type { Answer, QuestionDoc } from "common/config/firebase";
import { latestQuestion } from "common/services/question";

export const useLatestQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<null | {
    question: string;
    id: string;
  }>(null);
  const [answers, setAnswers] = useState<null | Answer[]>(null);
  const setAnswerFromSnap = (snap: QuerySnapshot<QuestionDoc>) =>
    setAnswers(snap.docs[0].data().answers);
  const setQuestionFromSnap = (snap: QuerySnapshot<QuestionDoc>) => {
    const [doc] = snap.docs;
    setQuestion({ question: doc.data().question, id: doc.id });
  };
  const onChange = useCallback((snap: QuerySnapshot<QuestionDoc>) => {
    setQuestionFromSnap(snap);
    setAnswerFromSnap(snap);
  }, []);

  useEffect(() => {
    let unsubscribe;
    latestQuestion().then((snap) => {
      setLoading(false);
      unsubscribe = onSnapshot(snap.query, onChange);
    });
    return unsubscribe;
  }, [onChange]);
  return { loading, question: question?.question, answers, id: question?.id };
};
