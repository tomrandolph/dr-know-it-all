import type { Answer } from "common/config/firebase";

interface Props {
  answer: Answer;
}

const colors = [
  "decoration-slate-500",
  "decoration-gray-500",
  "decoration-zinc-500",
  "decoration-neutral-500",
  "decoration-stone-500",
  "decoration-red-500",
  "decoration-orange-500",
  "decoration-amber-500",
  "decoration-yellow-500",
  "decoration-lime-500",
  "decoration-green-500",
  "decoration-emerald-500",
  "decoration-teal-500",
  "decoration-cyan-500",
  "decoration-sky-500",
  "decoration-blue-500",
  "decoration-indigo-500",
  "decoration-violet-500",
  "decoration-purple-500",
  "decoration-fuchsia-500",
  "decoration-pink-500",
  "decoration-rose-500",
] as const;

const computeHash = (string: string): number => {
  let hash = 0;
  for (const letter of string) {
    const ch = letter.charCodeAt(0);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const generateColor = (name: string): `${typeof colors[number]}` => {
  const index = (computeHash(name) + 61) % colors.length;
  return `${colors[index]}`;
};

export const AnswerText = ({ answer }: Props) => {
  let color: string = generateColor(answer.addedBy);
  if (answer.addedBy === "openai") {
    color = "no-underline";
  }
  return (
    <>
      {answer.spaceBefore && <> </>}
      <span className={`inline-block underline decoration-2 ${color}`}>
        {answer.answer}
      </span>
    </>
  );
};
