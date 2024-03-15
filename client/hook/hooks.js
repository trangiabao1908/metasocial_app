import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debounce, setDebounce] = useState("");

  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      setDebounce(value);
    }, delay);

    return () => clearTimeout(handleDebounce);
  }, [value, delay]);

  return debounce;
}

export default useDebounce;
