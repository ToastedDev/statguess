import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T = any>(
  key: string,
  defaultValue: T | (() => T),
) => {
  const [value, setValue] = useState<T>(defaultValue);

  const changeValue = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      const valueToSet =
        newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToSet);
      localStorage.setItem(key, JSON.stringify(valueToSet));
    },
    [key, value],
  );

  useEffect(() => {
    const stored = localStorage.getItem(key);

    if (!stored) {
      setValue(defaultValue);
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } else {
      setValue(JSON.parse(stored));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, changeValue] as const;
};
