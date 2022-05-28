import { useCallback, useEffect, useState } from "react";

export const useUsername = (): [string | undefined, (name: string) => void] => {
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((keyValue) => keyValue.includes("username"))
      ?.split("=")[1];
    setUsername(username);
  }, []);
  const setCookie = useCallback((name: string) => {
    document.cookie = `username=${name}`;
    setUsername(name);
  }, []);
  return [username, setCookie];
};
