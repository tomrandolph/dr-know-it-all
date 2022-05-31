import type { FormEventHandler } from "react";
import { useState } from "react";

interface Props {
  onAsk: (question: string) => Promise<unknown>;
}

export const AskQuestion = ({ onAsk }: Props) => {
  const [question, setQuestion] = useState("");
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onAsk(question);
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="question"
        placeholder="Enter a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input type="submit" value="Ask Question" />
    </form>
  );
};
