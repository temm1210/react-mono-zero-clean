export interface StatusUpdateHandler {
  stickToScreenTop: () => void;
  stickToContainerBottom: () => void;
  stickyToScreenBottom: () => void;
  unStick: () => void;
}
