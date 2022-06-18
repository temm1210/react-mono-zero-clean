import { render, screen } from "@testing-library/react";
import StickyContainer from "../StickyContainer";

describe("<StickyContainer />", () => {
  it("<StickyContainer />는 children을 render한다", () => {
    render(
      <StickyContainer>
        <div>children component</div>
      </StickyContainer>,
    );

    const child = screen.getByText("children component");

    expect(child).toBeInTheDocument();
  });
});
