import { render } from "@testing-library/react";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useClosetParent from "../useClosetParent";

describe("useClosetParent", () => {
  it("useClosetParent는 주어진 className에 해당하는 parent element를 찾을 수 있다", () => {
    const PARENT_CLASS_NAME = "parent-test";

    const { result } = renderHook(() => useClosetParent(`.${PARENT_CLASS_NAME}`));

    render(
      <div className={PARENT_CLASS_NAME}>
        <div ref={result.current.findParentFrom} />
      </div>,
    );

    console.log("className:", result.current.parentNode?.className);

    expect(result.current.parentNode?.className).toEqual(PARENT_CLASS_NAME);
  });
});
