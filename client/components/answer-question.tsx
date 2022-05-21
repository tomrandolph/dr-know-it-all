import { FC, FormEventHandler, useState } from "react";

interface Props {
  onAnswer: (question: string) => Promise<any>
}

export const AnswerQuestion: FC<Props> = ({onAnswer}) => {
  const [answer, setAnswer] = useState("");
  const [disabled, setDisabled] = useState(false)
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setDisabled(true)
    await onAnswer(answer);
    setAnswer('')
    setDisabled(false)

  }
  return (
    <form onSubmit={onSubmit}>
      <input
        disabled={disabled}
        type="text"
        name="Answer"
        placeholder="Your Turn"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <input type="submit" value="Answer Question" disabled={disabled} />
    </form>
  );
};
