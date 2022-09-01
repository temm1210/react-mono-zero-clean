export type CalculatorHandler = () => boolean;

export interface StickyModeMapperRef {
  isReachScreenToMode: CalculatorHandler;
  isReachContainerBottomToMode: CalculatorHandler;
  stickyRect: DOMRectReadOnly;
  fakeRect: DOMRectReadOnly;
  parentNode: Element | null;
}
