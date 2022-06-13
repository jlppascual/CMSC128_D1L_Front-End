import { useEffect, useState } from "react";

// Used to check if the clicked area when using the menu is not the menu
export default function OutsideClick(ref) {
  const [isClicked, setIsClicked] = useState();

  //changes state of isclicked depending on whether the click is in the selected element or not
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsClicked(true);
      } else {
        setIsClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  return isClicked;
}
