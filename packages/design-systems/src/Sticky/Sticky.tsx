import "./Sticky.scss";

export interface Props {
  children: React.ReactNode;
}

const Sticky = ({ children }: Props) => {
  return (
    <div className="sticky-wrap">
      {/* fake element */}
      <div className="sticky__fake" />
      <div>{children}</div>
    </div>
  );
};

export default Sticky;
