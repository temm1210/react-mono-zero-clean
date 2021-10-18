export interface StickyHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  unStick: () => void;
}
