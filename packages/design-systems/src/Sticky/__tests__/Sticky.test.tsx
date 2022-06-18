import { render, screen } from "@testing-library/react";
import Sticky from "../Sticky";

describe("Sticky tests", () => {
  it("should contains test text", () => {
    render(<Sticky>test</Sticky>);

    const heading = screen.getByText(/test/i);
    expect(heading).toBeInTheDocument();
  });
});
