import useDeepCompareEffect from "../useDeepCompareEffect";

type Context = Window | HTMLElement | null;
type WindowEventListener = Window["addEventListener"];

type ListenerEventType = keyof WindowEventMap;
type Listener = Parameters<WindowEventListener>[1];
type ListenerOptions = Parameters<WindowEventListener>[2];

/**
 *  주어진 listener를 eventName에 등록하고 제거해주는 hook
 * @param eventName 실제 등록할 Event의 종류(click, scroll..)
 * @param listener Event가 발생했을때 실행할 listener
 * @param options  listener함수가 실행될때 적용할 options
 * @param context Event에 등록할 대상(기본값 Window)
 */
function useEvent(
  eventName: ListenerEventType,
  listener: Listener,
  options?: ListenerOptions,
  context: Context = window,
) {
  // useEffect를 쓸때 dependencies로 object로 넘겨줄시 원하지않는 결과가 나올수있음
  // ex.값은 변하지 않았는데 오브젝트가 새로할당돼서 effect가 실행되는경우
  useDeepCompareEffect(() => {
    if (!context) return;

    if (context === window) {
      window.addEventListener(eventName, listener, options);
    } else {
      context.addEventListener(eventName, listener, options);
    }

    return () => {
      if (context === window) {
        window.removeEventListener(eventName, listener);
      } else {
        context.removeEventListener(eventName, listener, options);
      }
    };
  }, [context, eventName, listener, options]);
}

export default useEvent;
