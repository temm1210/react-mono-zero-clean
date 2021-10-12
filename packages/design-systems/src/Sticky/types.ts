export type SinglePosition = number | undefined;

export interface Position {
  top?: SinglePosition;
  bottom?: SinglePosition;
}
export interface StickyHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  unStick: () => void;
}
