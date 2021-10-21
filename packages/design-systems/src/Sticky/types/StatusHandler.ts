export interface StatusHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  stickyToScreenBottom: () => void;
  unStick: () => void;
}
