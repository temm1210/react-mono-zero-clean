/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dictionary } from "lodash";
import {
  mapValues,
  get,
  flatten,
  map,
  // tap,
  pickBy,
  identity,
  flow,
  isEmpty,
  omitBy,
  includes,
  values,
  omit,
} from "lodash/fp";
import { useState } from "react";

type HTMLTextInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface ErrorState {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
}

export interface Field {
  ref: HTMLTextInputElement;
  errors?: ErrorState;
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
export type Register = (name: string, validations?: ErrorState) => RegisterReturnRef;
export type HandleSubmit<F> = (onSubmit: OnSubmit<F>) => (e: React.MouseEvent<HTMLElement>) => void;

export type Errors<F> = {
  [key in keyof F]: ErrorState;
};
// K는 useForm<T> 에서 T에 해당됨
export interface UseFormReturn<F = Record<string, any>> {
  register: Register;
  handleSubmit: HandleSubmit<F>;
  errors: Errors<F>;
}

interface FormMappingData {
  value: string;
  errors: ErrorState | undefined;
}

// F는 useForm<T> 에서 T에 해당됨
// N는 form들의 name이됨
const useForm = <F, N extends keyof F = keyof F>(): UseFormReturn<F> => {
  const fields = {} as Fields<F>;
  // 해당 state의 update를 시점으로 fields값은 재할당이 이루어짐
  const [errors, setErrors] = useState({} as Errors<F>);

  // form tag에 필요한 attribute 설정
  const register: Register = (name, validations?) => {
    const setFieldsNotSafety = <O, K extends keyof O>(object: O, key: keyof O, value: O[K]) => {
      object[key] = value;
    };

    const setFieldsInit = (_name: string, _validations?: ErrorState) => (ref: HTMLTextInputElement | null) => {
      if (!ref) return;
      setFieldsNotSafety(fields, _name as N, { ref, errors: _validations });
    };

    return {
      name,
      ref: setFieldsInit(name, validations),
    };
  };

  // 에러 전략 설정 파일
  const generateErrorStrategy = (data: FormMappingData): { [key in keyof ErrorState]: any } => {
    const { value } = data;
    return {
      required: () => {
        const required = data.errors?.required;
        if (!required) return data;

        if (required && value) return { value, errors: { ...data.errors, required: false } };
        return { value, errors: { ...data.errors, required: true } };
      },
      maxLength: () => {
        const maxLength = data.errors?.maxLength;
        if (!maxLength) return data;

        const isValueBiggerThanMaxLength = (value?.length || 0) <= maxLength;

        if (maxLength && isValueBiggerThanMaxLength) return { value, errors: { ...data.errors, maxLength: false } };
        return { value, errors: { ...data.errors, maxLength: true } };
      },
      minLength: () => {
        const minLength = data.errors?.minLength;
        if (!minLength) return data;

        const isValueLessThanMinLength = (value?.length || 0) >= minLength;

        if (minLength && isValueLessThanMinLength) return { value, errors: { ...data.errors, minLength: false } };
        return { value, errors: { ...data.errors, minLength: true } };
      },
    };
  };

  // 전달된 validation을 실제 value에 적용후 결과를 return
  const validate =
    <D extends FormMappingData>(validationName: keyof ErrorState) =>
    (data: D) => {
      const strategy = generateErrorStrategy(data);
      const result = strategy[validationName]();

      return result;
    };

  // 각각의 error상태(required, minLength, maxLength)에따라 validate실행
  const updateByValidation = (data: Dictionary<FormMappingData>): FormMappingData => {
    return flow(
      mapValues(pickBy(identity)),
      // tap(console.log),
      mapValues(validate<FormMappingData>("required")),
      // tap(console.log),
      mapValues(validate<FormMappingData>("maxLength")),
      // tap(console.log),
      mapValues(validate<FormMappingData>("minLength")),
      // tap(console.log),
      omitBy(isEmpty),
    )(data);
  };

  const formAdapter = <D extends Field>(data: D) => ({
    value: data.ref.value,
    errors: data.errors,
  });

  const omitMapValues =
    <D extends Record<string, any>, K extends keyof D>(data: D) =>
    (key: K) =>
      mapValues(omit<D, K>(key))(data);

  const handleSubmit: HandleSubmit<F> = (onSubmit) => (e) => {
    e.preventDefault();

    // fields값은 할당과 초기화가 반복됨
    // 초기화시 다시 register가 작동하여 변수설정
    const adaptedFormData = mapValues(formAdapter)(fields);
    const formValueAndErrorState = updateByValidation(adaptedFormData);

    // register의 두번째 인자로 validation(ErrorState)이 전달됐을 시 검사
    // 각 form filed에 대해 전달된 모든 validation(ErrorState)검사 후 하나라도 validation에 통과하지 못하면 true를 반환
    const isNotValidation = flow(
      values,
      mapValues(get("errors")),
      // tap(console.log),
      map(values),
      flatten,
      // tap(console.log),
      includes(true),
    )(formValueAndErrorState);

    // formValueAndErrorState을 데이터로 받아 omit을 하는 함수가 Return
    const omitFormData = omitMapValues(formValueAndErrorState);
    // formValueAndErrorState에서 value를 제거한 값을 return
    const errorState = omitFormData("value") as Errors<F>;
    // formValueAndErrorState에서 errors를 제거한 값을 return
    const formValue = omitFormData("errors");

    const form = mapValues(get("value"))(formValue) as FormData<F>;

    setErrors(errorState);

    // validation에 실패하면 submit을 하지않음
    if (isNotValidation) return;

    // 변형된 데이터를 실제 form에 전달
    onSubmit(form);
  };

  return { register, handleSubmit, errors };
};

export default useForm;
