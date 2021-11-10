import { EffectCallback, useEffect } from "react";

const useDidMount = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

export default useDidMount;
