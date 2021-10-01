import { createContext, useRef, RefObject } from "react";
import "./StickyContainer.scss";

export const StickyContext = createContext<RefObject<HTMLDivElement> | null>(null);
export interface Props {
  children: React.ReactNode;
}

function StickyContainer({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <StickyContext.Provider value={ref}>
      <div ref={ref} className="sticky-container">
        {children}
      </div>
    </StickyContext.Provider>
  );
}

export default StickyContainer;
