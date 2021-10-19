export interface StickyHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  unStick: () => void;
}

export type StickyMode = "top" | "bottom";

export interface ChildHandler {
  update: () => void;
}
