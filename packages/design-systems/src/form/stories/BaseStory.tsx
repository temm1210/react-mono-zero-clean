import { Story } from "@storybook/react";
import useForm from "../useForm";

export interface FormState {
  name: string;
  password: string;
}

const BaseStory: Story<undefined> = () => {
  const { register, handleSubmit } = useForm<FormState>();

  const onSubmit = (data: FormState) => {
    console.log(data);
  };
  return (
    <div>
      <input type="text" {...register("name")} />
      <input type="password" {...register("password")} />
      <button type="submit" onClick={handleSubmit(onSubmit)}>
        submit
      </button>
    </div>
  );
};

export default BaseStory;
