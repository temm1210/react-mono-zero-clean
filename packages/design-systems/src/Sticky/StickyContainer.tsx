import parentSelector from "./parentSelector";
import "./StickyContainer.scss";

export interface Props {
  children: React.ReactNode;
}

const StickyContainer = ({ children }: Props) => {
  return <div className={parentSelector}>{children}</div>;
};

export default StickyContainer;
