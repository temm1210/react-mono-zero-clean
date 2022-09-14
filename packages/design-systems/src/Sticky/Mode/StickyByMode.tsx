/* eslint-disable @typescript-eslint/no-explicit-any */
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
  modeRef: React.RefObject<StickyModeMapperRef>;
}

const StickyByMode = ({ mode, top, modeRef, bottom, ...rest }: StickyByModeProps) => {
  const mapper = {
    top: {
      component: TopSticky,
      props: {
        top,
        ref: modeRef,
        ...rest,
      },
    },

    bottom: {
      component: BottomSticky,
      props: {
        bottom,
        ref: modeRef,
        ...rest,
      },
    },
  } as any;

  return React.createElement(mapper[mode].component, mapper[mode].props);
};

export default StickyByMode;
