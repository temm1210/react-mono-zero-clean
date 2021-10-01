export interface Props {
  /** test */
  children: React.ReactNode;
}

function Sticky({ children }: Props) {
  return <div>{children}</div>;
}

export default Sticky;
