import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
 <div
    className="custom-cursor fixed w-6 h-6 border-2 border-green-600 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50 transition-transform duration-150"
  ></div>  );
}
