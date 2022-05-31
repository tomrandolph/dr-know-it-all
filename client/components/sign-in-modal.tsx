import type { FormEventHandler, ChangeEventHandler } from "react";
import { useState } from "react";

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
    <div className={"p-8 fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-black/40 flex justify-center flex-col"}>
      <div className={"max-w-lg text-center m-auto mt-20 py-5 px-10 w-9/12 min-w-fit rounded-2xl bg-gray-50"}>
        <h1 className="text-xl pb-4">Welcome to Dr. Know-it-all!</h1>
        <p>
          Collaborate with AI to answer the worlds hardest problems, one word at
          a time.
        </p>
        <p>To get started, give us a name!</p>
        <span className="invalid">{invalidText}</span>
        <form onSubmit={onSubmit} className="w-full max-w-xs min-w-fit m-auto">
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
