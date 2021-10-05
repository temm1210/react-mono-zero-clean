import { useEffect } from "react";

type Context = Window | HTMLElement | null;
type WindowEventListener = Window["addEventListener"];

type ListenerEventType = keyof WindowEventMap;
type Listener = Parameters<WindowEventListener>[1];
type ListenerOptions = Parameters<WindowEventListener>[2];

/**
 * .addEventListener, removeListener를 지원하는 커스텀 훅
 * @param eventName 실제 등록할 Event의 종류(click, scroll..)
 * @param listener Event가 발생했을때 실행할 listener
 * @param options  listener함수가 실행될때 적용할 options
 * @param context Event에 등록할 대상(기본값 Window)
 */
const useEvent = (
  eventName: ListenerEventType,
  listener: Listener,
  options?: ListenerOptions,
  context: Context = window,
) => {
  useEffect(() => {
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
  }, [context, eventName, listener, JSON.stringify(options)]);
};

export default useEvent;
