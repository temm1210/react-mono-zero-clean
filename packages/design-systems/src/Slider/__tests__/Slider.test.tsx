import { render, screen } from "@testing-library/react";
import Slider from "../Slider";

test("role이 slider인 tag가 존재한다.", () => {
  render(<Slider />);

  expect(screen.getByRole("slider")).toBeInTheDocument();
});
