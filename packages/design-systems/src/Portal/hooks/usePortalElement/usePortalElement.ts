import { useEffect, useState } from "react";

type PortalElement = Element | null;

export interface UsePortalElementReturn {
  portalElement: PortalElement;
  isExistParent: boolean;
}

// Portal을 할 상위 element의 설정과 기존에 사용하는 상위 element가 있는지 확인해주는 hook
const usePortalElement = (className: string): UsePortalElementReturn => {
  const [portalElement, setPortalElement] = useState<PortalElement>(null);
  const [isExistParent, setIsExistParent] = useState(false);

  const setState = (element: PortalElement, isParent: boolean) => {
    setPortalElement(element);
    setIsExistParent(isParent);
  };

  useEffect(() => {
    // className에 해당하는 element가 있으면 해당 element를 portalElement로 설정
    const element = document.querySelector(`.${className}`);
    if (element) {
      return setState(element, true);
    }

    // className에 해당하는 element가 없다면 element생성 후 portalElement로 설정
    const containerElement = document.createElement("div");
    containerElement.classList.add(className);
    setState(containerElement, false);
  }, [className]);

  return { portalElement, isExistParent };
};

export default usePortalElement;
