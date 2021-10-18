import { DependencyList, EffectCallback, useRef, useEffect } from "react";
import { isPrimitive } from "@project/utils";
import isEqual from "../utils/isEqual";

// effect의 dependency가 null이아닌 undefined로 설정되어있어서 undefined사용
type DependencyRef = DependencyList | undefined;

/**
 * useEffect를 사용할 때 dependency값으로 object를 할당하면 값은 변하지않아도
 * object가 새로 만들어질 경우 effect가 실행되는 문제를 해결하기위한 hook
 * object를 deep compare해서 값이 바뀐경우만 effect를 실행
 * @param effect
 * @param dependencies 원시타입이 아닌 배열 값
 */
const useDeepCompareEffect = (effect: EffectCallback, dependencies: DependencyList) => {
  if (dependencies.every(isPrimitive)) {
    throw Error(
      "`useDeepCompareEffect` should not be used with primitive dependencies. Use not primitive dependencies.",
    );
  }

  const ref = useRef<DependencyRef>(undefined);

  // ref를 쓰지않고 일반 로컬변수를쓰면 effect가 새로 실행될때 마다 변수가 새로 할당되기 때문에 값이 똑같아도 다른 값으로 인식함
  if (!ref.current || !isEqual(dependencies, ref.current)) {
    ref.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, ref.current);
};

export default useDeepCompareEffect;
