import { FC, FormEventHandler, ChangeEventHandler, useState } from "react";
import style from "./answer-question.module.css";
interface Props {
  onAnswer: (question: string) => Promise<any>;
}

export const AnswerQuestion: FC<Props> = ({ onAnswer }) => {
  const [answer, setAnswer] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [invalidText, setInvalidText] = useState<string | null>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setDisabled(true);
    await onAnswer(answer);
    setAnswer("");
    setDisabled(false);
  };
  const onInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setAnswer(value);
    if (value.split(" ").length > 1) {
      return setInvalidText("Only submit one word");
    }
    return setInvalidText(null);
  };
  return (
    <form onSubmit={onSubmit} className={style.form}>
      <input
        disabled={disabled}
        type="text"
        name="Answer"
        placeholder="Your Turn"
        value={answer}
        onChange={onInput}
      />
      <span className={style.invalid}>{invalidText}</span>
      <input
        type="submit"
        value="Answer Question"
        disabled={disabled || invalidText != null}
      />
    </form>
  );
};
