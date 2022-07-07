import React, { Children } from "react";
import { parentSelector } from "./utils";
import "./StickyContainer.scss";

export interface Props {
  children: React.ReactNode;
}

function hasReactComponent(component: React.ReactElement, targetName: string): boolean {
  if (typeof component === "string") return false;

  if ((component.type as React.ComponentType).displayName === targetName) return true;

  if (component.props.children) {
    return Children.map(component.props.children, (child: React.ReactElement) => child).reduce((prev, curr) => {
      return prev || hasReactComponent(curr, targetName);
    }, false);
  }

  return false;
}

const StickyContainer = ({ children }: Props) => {
  const hasStickyComponent = Children.map(children, (child) => child)?.reduce((prev, currentChild) => {
    return prev || hasReactComponent(currentChild as React.ReactElement, "Sticky");
  }, false);

  if (!hasStickyComponent)
    throw Error("'StickyContainer component'는 'Sticky component'를 반드시 하나 이상 가지고 있어야합니다.");

  return <div className={parentSelector}>{children}</div>;
};

export default StickyContainer;
