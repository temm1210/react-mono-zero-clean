import { renderHook } from "@testing-library/react";
import useEvent, {
  UseEventListenerOptions,
  UseEventListener,
  UseEventContext,
  UseEventListenerEventType,
} from "../useEvent";

interface Props {
  eventType: UseEventListenerEventType;
  listener: UseEventListener;
  options?: UseEventListenerOptions;
  context: UseEventContext;
}

const props: Props[] = [
  {
    eventType: "click",
    listener: jest.fn(),
    context: window,
  },
  {
    eventType: "change",
    listener: jest.fn(),
    context: document.createElement("div"),
  },
];

describe("useEvent", () => {
  beforeEach(() => {
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });
  it("mount/unmount시 window.addEventListener/window.removeEventListener가 eventType, listener, option를 인자로 가지고 호출된다.", () => {
    const { unmount } = renderHook(() =>
      useEvent(props[0].eventType, props[0].listener, props[0].options, props[0].context),
    );

    expect(window.addEventListener).toHaveBeenCalledTimes(1);
    expect(window.addEventListener).toHaveBeenLastCalledWith(props[0].eventType, props[0].listener, props[0].options);

    expect(window.removeEventListener).toHaveBeenCalledTimes(0);

    unmount();

    expect(window.addEventListener).toHaveBeenCalledTimes(1);

    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    expect(window.removeEventListener).toHaveBeenLastCalledWith(
      props[0].eventType,
      props[0].listener,
      props[0].options,
    );
  });

  it("mount/unmount시 context.addEventListener/context.removeEventListener가 eventType, listener, option를 인자로 가지고 호출된다.", () => {
    jest.spyOn(props[1].context, "addEventListener");
    jest.spyOn(props[1].context, "removeEventListener");

    const { unmount } = renderHook(() =>
      useEvent(props[1].eventType, props[1].listener, props[1].options, props[1].context),
    );

    expect(window.addEventListener).toHaveBeenCalledTimes(0);
    expect(window.removeEventListener).toHaveBeenCalledTimes(0);

    expect(props[1].context.removeEventListener).toHaveBeenCalledTimes(0);
    expect(props[1].context.addEventListener).toHaveBeenCalledTimes(1);

    expect(props[1].context.addEventListener).toHaveBeenLastCalledWith(
      props[1].eventType,
      props[1].listener,
      props[1].options,
    );

    unmount();

    expect(window.addEventListener).toHaveBeenCalledTimes(0);
    expect(window.removeEventListener).toHaveBeenCalledTimes(0);

    expect(props[1].context.addEventListener).toHaveBeenCalledTimes(1);
    expect(props[1].context.removeEventListener).toHaveBeenCalledTimes(1);

    expect(props[1].context.removeEventListener).toHaveBeenLastCalledWith(
      props[1].eventType,
      props[1].listener,
      props[1].options,
    );
  });
});
