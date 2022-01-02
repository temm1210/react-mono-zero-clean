/* eslint-disable @typescript-eslint/no-explicit-any */
import mapValues from "lodash/mapValues";

type HTMLTextInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface Field {
  ref: HTMLTextInputElement;
}

export type Fields<F> = {
  [key in keyof F]: Field;
};

type FormData<F> = {
  [key in keyof F]: string;
};
export type OnSubmit<F> = (data: FormData<F>) => void;

export interface RegisterReturnRef {
  name: string;
  ref: (ref: HTMLTextInputElement | null) => void;
}
export type Register = (name: string) => RegisterReturnRef;
export type HandleSubmit<F> = (onSubmit: OnSubmit<F>) => (e: React.MouseEvent<HTMLElement>) => void;

// K는 useForm<T> 에서 T에 해당됨
export interface UseFormReturn<F = Record<string, any>> {
  register: Register;
  handleSubmit: HandleSubmit<F>;
}

// S는 useForm<T> 에서 T에 해당됨
// N는 form들의 name이됨
const useForm = <F, N extends keyof F = keyof F>(): UseFormReturn<F> => {
  const fields = {} as Fields<F>;

  // form tag에 필요한 attribute 설정
  const register: Register = (name) => {
    const setFieldsNotSafety = <O, K extends keyof O>(object: O, key: keyof O, value: O[K]) => {
      object[key] = value;
    };

    const setFieldsInit = (_name: string) => (ref: HTMLTextInputElement | null) => {
      if (!ref) return;
      setFieldsNotSafety(fields, _name as N, { ref });
    };

    return {
      name,
      ref: setFieldsInit(name),
    };
  };

  // onSubmit에 전달될 데이터의 형태를 정의
  const formAdapter = <D extends Field>(data: D) => {
    return data.ref.value;
  };

  const handleSubmit: HandleSubmit<F> = (onSubmit) => (e) => {
    e.preventDefault();

    const adaptedFormData = mapValues(fields, formAdapter);
    console.log("adaptedFormData:", adaptedFormData);
    // 변형된 데이터를 실제 form에 전달
    onSubmit(adaptedFormData);
  };

  return { register, handleSubmit };
};

export default useForm;
