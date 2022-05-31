import type { FormEventHandler, ChangeEventHandler } from "react";
import { useState } from "react";
import styles from "./modal.module.css";

interface Props {
  onEnterName: (name: string) => void;
}

export const SignInModal = ({ onEnterName }: Props) => {
  const [name, setName] = useState<string>("");
  const [invalidText, setInvalidText] = useState<string | null>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (name == null) {
      setInvalidText("Must enter a name");
      return;
    }
    const trimmed = name.trim();

    if (trimmed.length > 20) {
      setInvalidText("Name too long");
      return;
    }
    if (trimmed.length < 3) {
      setInvalidText("Name too short");
      return;
    }
    onEnterName(trimmed);
  };
  const onInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    const trimmed = value.trim();
    setName(trimmed);
    if (!trimmed.match(/^[A-Za-z\s]*$/)) {
      setInvalidText("Name must contain only letters and spaces");
      return;
    }
    if (trimmed.length > 20) {
      return setInvalidText("Name too long");
    }
    return setInvalidText(null);
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h1>Welcome to Dr. Know-it-all!</h1>
        <p>
          Collaborate with AI to answer the worlds hardest problems, one word at
          a time.
        </p>
        <p>To get started, give us a name!</p>
        <span className="invalid">{invalidText}</span>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Leroy Jenkins"
            onChange={onInput}
            value={name}
          />
          <input type="submit" value="Start Playing" />
        </form>
      </div>
    </div>
  );
};
