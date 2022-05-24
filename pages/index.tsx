import { AnswerQuestion } from "client/components/answer-question";
import { AskQuestion } from "client/components/ask-question";
import { useLatestQuestion } from "client/hooks/use-latest-question";
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import type { FC } from "react";
import { Logger } from "common/logger";
import { useAddToAnswer } from "client/hooks/use-add-to-answer";
import { useAskQuestion } from "client/hooks/use-ask-question";
import { latestQuestion, formatAnswer } from "common/services/question";
interface Props {
  askedQuestion: string | null;
  existingAnswer: string | null;
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  Logger.log("Getting props for home page");

  Logger.log("Fetching question and answer");
  const snap = await latestQuestion();
  Logger.log(`Snap: ${snap}`, snap);
  const doc = snap.docs[0].data();
  const askedQuestion = doc.question;
  Logger.log("answers,", doc.answers);
  const existingAnswer = formatAnswer(doc.answers);
  Logger.log("Got question:", askedQuestion);
  Logger.log("Got answer:", existingAnswer);
  return {
    props: {
      askedQuestion,
      existingAnswer,
    },
  };
}

const Home: FC<Props> = ({ askedQuestion, existingAnswer }) => {
  const [changeQuestion, setChangeQuestion] = useState(false);
  const { ask } = useAskQuestion();
  const onAsk = async (question: string) => {
    await ask(question);
    setChangeQuestion(false);
  };
  const {
    question: latestQuestion,
    answer: latestAnswer,
    id,
  } = useLatestQuestion();
  const { add, compute } = useAddToAnswer(id);
  const currentQuestion = latestQuestion ?? askedQuestion;
  const currentAnswer = latestAnswer ?? existingAnswer;
  const onAnswer = async (word: string) => {
    await add(word);
    await compute();
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
            {currentQuestion && (
              <a
                className={styles.toggle}
                onClick={() => setChangeQuestion(false)}
              >
                Back to Answer
              </a>
            )}
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
            <AnswerQuestion onAnswer={onAnswer} answer={currentAnswer} />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
