import { render, screen } from "@testing-library/react";
import Sticky from "../Sticky";

describe("App tests", () => {
  it("should contains the heading 1", () => {
    render(<Sticky>test</Sticky>);

    const heading = screen.getByText(/test/i);
    expect(heading).toBeInTheDocument();
  });
});
