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
import { latestQuestion } from "common/services/question";
import type { GetServerSideProps } from "next";
import { SignInModal } from "client/components/sign-in-modal";
import { useUsername } from "client/hooks/use-username";
interface Props {
  askedQuestion: string | null;
}

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  props: Props;
}> => {
  const cookies = context.req.cookies;
  Logger.log("cookies", cookies);
  Logger.log("Getting props for home page");

  Logger.log("Fetching question and answer");
  const snap = await latestQuestion();
  const doc = snap.docs[0].data();
  const askedQuestion = doc.question;
  Logger.log("Got question:", askedQuestion);

  return {
    props: {
      askedQuestion,
    },
  };
};

const Home: FC<Props> = ({ askedQuestion }) => {
  const [changeQuestion, setChangeQuestion] = useState(false);
  const { ask } = useAskQuestion();
  const [username, setUsername] = useUsername();
  const onAsk = async (question: string) => {
    await ask(question);
    setChangeQuestion(false);
  };
  const {
    question: latestQuestion,
    answers: latestAnswers,
    id,
  } = useLatestQuestion();
  const { add, compute } = useAddToAnswer(id, username);
  const currentQuestion = latestQuestion ?? askedQuestion;
  const currentAnswers = latestAnswers;

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
            <AnswerQuestion onAnswer={onAnswer} answers={currentAnswers} />
          </>
        )}
        {!username && <SignInModal onEnterName={setUsername} />}
      </main>
    </div>
  );
};

export default Home;
