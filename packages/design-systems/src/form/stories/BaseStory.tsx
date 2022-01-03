import { Story } from "@storybook/react";
import useForm from "../useForm";

export interface FormState {
  name: string;
  email: string;
  password: string;
}

const BaseStory: Story<undefined> = () => {
  const { register, handleSubmit, errors } = useForm<FormState>();

  console.log("errors:", errors);
  const onSubmit = (data: FormState) => {
    console.log(data);
  };
  return (
    <div>
      <input type="text" {...register("name")} />
      <input type="password" {...register("password", { required: true, minLength: 10 })} />
      <input type="text" {...register("email", { required: true, maxLength: 15, minLength: 10 })} />
      <button type="submit" onClick={handleSubmit(onSubmit)}>
        submit
      </button>
    </div>
  );
};

export default BaseStory;
