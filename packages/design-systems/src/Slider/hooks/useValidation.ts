import { useEffect } from "react";

export interface UseValidationProps {
  max: number;
  min: number;
  defaultValue: number;
}

/**
 * throw error의 대상이 되는 validation만 진행
 */
function useValidation({ max, min, defaultValue }: UseValidationProps) {
  useEffect(() => {
    if (min >= max) {
      throw Error("'max prop' must be greater than 'min prop'");
    }

    if (min > defaultValue || defaultValue > max) {
      throw Error("'defaultValue prop' must be equal or greater than 'min prop'");
    }
  }, [max, min, defaultValue]);
}

export default useValidation;
