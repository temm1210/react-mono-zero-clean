import { renderHook, act } from "@testing-library/react-hooks";
import useRect from "../useRect";

describe("useRect", () => {
  it("default rect는 전부 0이다.", () => {
    const element = document.createElement("div");
    const { result } = renderHook(() => useRect());

    console.log("result:", result);

    act(() => {
      result.current[0](element);
    });

    const rect = result.current[1]();

    expect(rect).toMatchObject({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    });
  });
});
