/* eslint-disable @typescript-eslint/no-explicit-any */
type HTMLTextInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface Field {
  ref: HTMLTextInputElement;
}

export type Fields<K> = {
  [key in keyof K]: Field;
};
export type OnSubmit<K> = (data: FormData<K>) => void;

export interface RegisterReturnRef {
  name: string;
  ref: (ref: HTMLTextInputElement | null) => void;
}
export type Register = (name: string) => RegisterReturnRef;
export type HandleSubmit<K> = (onSubmit: OnSubmit<K>) => (e: React.MouseEvent<HTMLElement>) => void;

// K는 useForm<T> 에서 T에 해당됨
export interface UseFormReturn<K = Record<string, any>> {
  register: Register;
  handleSubmit: HandleSubmit<K>;
}

type FormData<K> = {
  [key in keyof K]: string;
};

// S는 useForm<T> 에서 T에 해당됨
// N는 form들의 name이됨
const useForm = <S, N extends keyof S = keyof S>(): UseFormReturn<S> => {
  const fields = {} as Fields<S>;

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

  const handleSubmit: HandleSubmit<S> = (onSubmit) => (e) => {
    e.preventDefault();

    console.log("fields:", fields);
    // 변형된 데이터를 실제 form에 전달
    onSubmit(fields as any);
  };

  return { register, handleSubmit };
};

export default useForm;
