import { render } from "@testing-library/react";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useClosetParent from "../useClosetParent";

describe("useClosetParent", () => {
  const PARENT_CLASS_NAME = "parent-test";

  it("className에 해당하는 parent element를 찾을 수 있다", () => {
    const { result } = renderHook(() => useClosetParent(`.${PARENT_CLASS_NAME}`));

    render(
      <div className={PARENT_CLASS_NAME}>
        <div ref={result.current.findParentFrom} />
      </div>,
    );

    expect(result.current.parentNode?.className).toEqual(PARENT_CLASS_NAME);
  });

  it("className에 해당하는 parent element이 없다면 null을 return 해야한다", () => {
    const { result } = renderHook(() => useClosetParent(`.${PARENT_CLASS_NAME}`));

    render(
      <div>
        <div ref={result.current.findParentFrom} />
      </div>,
    );
    expect(result.current.parentNode).toBeNull();

    render(<div ref={result.current.findParentFrom} />);
    expect(result.current.parentNode).toBeNull();
  });
});
