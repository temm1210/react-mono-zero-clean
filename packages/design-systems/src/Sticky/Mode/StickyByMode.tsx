import React from "react";
import BottomSticky from "./BottomSticky";
import TopSticky from "./TopSticky";
import { StickyModeMapperRef } from "../interface";

export type StickyModeType = "top" | "bottom";

export interface StickyByModeProps {
  mode: StickyModeType;
  top: number;
  bottom: number;
  width: number;
  height: number;
  isSticky: boolean;
  isAbsolute: boolean;
  children: React.ReactNode;
  testRef: React.RefObject<StickyModeMapperRef>;
}

const StickyByMode = ({ mode, testRef, top, bottom, children, ...rest }: StickyByModeProps) => {
  const mapper = {
    top: (
      <TopSticky ref={testRef} top={top} {...rest}>
        {children}
      </TopSticky>
    ),

    bottom: (
      <BottomSticky ref={testRef} bottom={bottom} {...rest}>
        {children}
      </BottomSticky>
    ),
  };

  return mapper[mode];
};

export default StickyByMode;
