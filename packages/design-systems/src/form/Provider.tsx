import React from "react";
import { UseFormReturn } from "./hooks/useForm";
import FormContext from "./contexts/FormContext";

export interface Props {
  children: React.ReactNode;
  value: UseFormReturn;
}

const FormProvider = ({ value, children }: Props) => {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export default FormProvider;
