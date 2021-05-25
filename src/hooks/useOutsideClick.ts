import { useEffect } from "react";

const useOutsideClick = <T,>(ref: React.RefObject<T & HTMLElement>, callback: Function) => {
  // event из useEffect
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;