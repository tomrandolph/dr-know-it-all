import { onSnapshot, QuerySnapshot } from "firebase/firestore";
import { QuestionDoc } from "common/config/firebase";
import { latestQuestion, formatAnswer } from "common/services/question";
import { useEffect, useState, useCallback } from "react";

export const useLatestQuestion = () => {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<null | {
    question: string;
    id: string;
  }>(null);
  const [answer, setAnswer] = useState<null | string>(null);
  const setAnswerFromSnap = (snap: QuerySnapshot<QuestionDoc>) =>
    setAnswer(formatAnswer(snap.docs[0].data().answers));
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
  return { loading, question: question?.question, answer, id: question?.id };
};
