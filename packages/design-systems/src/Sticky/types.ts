export type CalculatorHandler = () => boolean;

/**
 * forwardRef에서 사용할 type
 * 각 mode마다 반드시 해당 interface를 구현해야함
 */
export interface StickyModeMapperRef {
  isReachScreenToMode: CalculatorHandler;
  isReachContainerBottomToMode: CalculatorHandler;
  stickyRect: DOMRectReadOnly;
  fakeRect: DOMRectReadOnly;
  parentNode: Element | null;
}
