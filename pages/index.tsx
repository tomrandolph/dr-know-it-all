import { AnswerQuestion } from "client/components/answer-question";
import { AskQuestion } from "client/components/ask-question";
import { useQuestion } from "client/hooks/use-question";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import type { FC } from "react";
import { getClient } from "backend/config/redis";
interface Props {
  askedQuestion: string | null;
  existingAnswer: string | null;
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  const redis = await getClient();
  console.log('Fetching question and answer')
  const askedQuestion = await redis.get("question");
  const existingAnswer = await redis.get("answer");
  return {
    props: {
      askedQuestion,
      existingAnswer,
    },
  };
}

const Home: FC<Props> = ({ askedQuestion, existingAnswer }) => {
  const [changeQuestion, setChangeQuestion] = useState(false);
  const [question, setQuestion] = useState<null | string>(null);
  const [answer, setAnswer] = useState<null | string>(null);
  const q = useQuestion();
  const onAsk = async (question: string) => {
    await q.ask(question);
    setQuestion(question);
    setAnswer('')
    setChangeQuestion(false);
  };
  const currentQuestion = question ?? askedQuestion;
  const currentAnswer = answer ?? existingAnswer;
  const onAnswer = async (word: string) => {
    const newAnswer = await q.answer(currentAnswer, word);
    console.log(newAnswer);
    setAnswer(newAnswer);
  };
  const asking = !currentQuestion || changeQuestion;
  const answering = !asking;

  return (
    <div>
      <Head>
        <title>Dr. Knowitall</title>
      </Head>

      <main className={styles.main}>
        {asking && (
          <>
            <h3>Ask A New Question</h3>
            {currentQuestion && <a
              className={styles.toggle}
              onClick={() => setChangeQuestion(false)}
            >
              Back to Answer
            </a>}
            <AskQuestion onAsk={onAsk} />
          </>
        )}
        {answering && (
          <>
            <h3>{currentQuestion}</h3>
            <a
              className={styles.toggle}
              onClick={() => setChangeQuestion(true)}
            >
              Change Question
            </a>
            <AnswerQuestion onAnswer={onAnswer} />
            <p>{currentAnswer}</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
