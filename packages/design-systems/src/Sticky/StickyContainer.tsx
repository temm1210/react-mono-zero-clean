import "./StickyContainer.scss";

export interface Props {
  children: React.ReactNode;
}

function StickyContainer({ children }: Props) {
  return <div className="sticky-container">{children}</div>;
}

export default StickyContainer;
