
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../component/ui/Input";
import { LoginForm } from "../data";
import InputErrorMessage from "../component/ui/InputErrMsj";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loginschema } from "../validation";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../config/AxiosConfig";
import { AxiosError } from "axios";
import { IAxiosErrResponse } from "../interfaces";
import Button from "../component/ui/Button";


interface IFormInput {
  identifier: string;
  password: string;
}
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(Loginschema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log("DATA", data);
    setIsLoading(true);

    try {
      //  * 2 - Fulfilled => SUCCESS => (OPTIONAL)
      const { status, data: resData } = await axiosInstance.post(
        "/auth/local",
        data
      );
      console.log(data);
      console.log(resData);
      if (status === 200) {
        toast.success("You will navigate to the home page after 2 seconds.", {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
        localStorage.setItem("loggedInUser", JSON.stringify(resData));
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      //  * 3 - Rejected => FAILED => (OPTIONAL)
      console.log(error);
      const errorObj = error as AxiosError<IAxiosErrResponse>;
      // console.log(error);
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders
  const renderLoginForm = LoginForm.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
