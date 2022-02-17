import React from "react";
import FormContext from "../contexts/FormContext";
import { UseFormReturn } from "./useForm";

export type UseFormContextReturn = UseFormReturn | null;

const useFormContext = (): UseFormContextReturn => {
  return React.useContext(FormContext);
};

export default useFormContext;
