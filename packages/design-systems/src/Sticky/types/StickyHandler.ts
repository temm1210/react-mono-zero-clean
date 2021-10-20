export interface StickyHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  stickyToScreenBottom: () => void;
  unStick: () => void;
}
