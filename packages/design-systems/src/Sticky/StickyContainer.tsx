import { useRef } from "react";
import "./StickyContainer.scss";

function StickyContainer() {
  const ref = useRef<HTMLDivElement>(null);
  return <div ref={ref} className="sticky-container" />;
}

export default StickyContainer;
