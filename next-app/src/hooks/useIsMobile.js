import { useState, useEffect, useRef } from "react";

const useIsMobile = (breakpoint = 992) => {
  const [isMobile, setIsMobile] = useState(null);
  const prevMode = useRef(null); // to track previous mode

  useEffect(() => {
    let resizeTimer;

    const checkMobile = () => {
      const currentIsMobile = window.innerWidth <= breakpoint;
      setIsMobile(currentIsMobile);

      // Only reload if mode changes (cross breakpoint)
      if (prevMode.current !== null && prevMode.current !== currentIsMobile) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          window.location.reload();
        }, 500); // debounce
      }

      prevMode.current = currentIsMobile; // update previous mode
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
