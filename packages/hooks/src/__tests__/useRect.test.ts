import { renderHook, act } from "@testing-library/react-hooks";
import useRect from "../useRect";

it("default rect는 전부 0이다.", () => {
  const element = document.createElement("div");
  const { result } = renderHook(() => useRect());

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

it("element의 rect가 바뀌면 바뀐값으로 다시 rect가 계산되어야 한다.", () => {
  const element = document.createElement("div");
  const { result } = renderHook(() => useRect());

  act(() => {
    result.current[0](element);
  });

  const generateRect = result.current[1];

  expect(generateRect()).toMatchObject({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  // update rect
  element.getBoundingClientRect = jest.fn().mockReturnValueOnce({
    width: 200,
    height: 100,
    top: 10,
    left: 10,
    bottom: 10,
    right: 0,
  });

  expect(generateRect()).toMatchObject({
    width: 200,
    height: 100,
    top: 10,
    left: 10,
    bottom: 10,
    right: 0,
  });
});
