export type SinglePosition = number | null;

export interface StickyHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  unStick: () => void;
}
