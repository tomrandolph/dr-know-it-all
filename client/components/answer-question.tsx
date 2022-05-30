import { FC, FormEventHandler, ChangeEventHandler, useState } from "react";
import { AnswerText } from "./answer-text";
import { Answer } from "common/config/firebase";
interface Props {
  onAnswer: (question: string) => Promise<any>;
  answers: Answer[] | null;
}

export const AnswerQuestion: FC<Props> = ({ answers, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [invalidText, setInvalidText] = useState<string | null>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setDisabled(true);
    await onAnswer(userAnswer);
    setUserAnswer("");
    setDisabled(false);
  };
  const onInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setUserAnswer(value);
    if (value.split(" ").length > 1) {
      return setInvalidText("Only submit one word");
    }
    return setInvalidText(null);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          disabled={disabled}
          type="text"
          name="Answer"
          placeholder="Your Turn"
          value={userAnswer}
          onChange={onInput}
          autoCapitalize={answers ? "none" : "on"}
        />
        <span className="invalid">{invalidText}</span>
        <input
          type="submit"
          value="Answer Question"
          disabled={disabled || invalidText != null}
        />
      </form>
      <div className="container" style={{ display: "block" }}>
        {answers?.map((answer, i) => (
          <AnswerText key={i} answer={answer} />
        ))}
      </div>
    </>
  );
};
