import Input from "../component/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "../component/ui/InputErrMsj";
import { RegisterForm } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { Registerschema } from "../validation";
import axiosinstance from "../config/AxiosConfig";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IAxiosErrResponse} from "../interfaces";

interface IFormInput {
    username: string;
    email: string;
    password: string;
  }
  const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<IFormInput>({
      resolver: yupResolver(Registerschema),
    });
  
    // Handlers
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
      console.log("DATA", data);
      setIsLoading(true);
  
      try {
        //  * 2 - Fulfilled => SUCCESS => (OPTIONAL)
  
        const { status } = await axiosinstance.post("/auth/local/register", data);
  
        if (status === 200) {
          toast.success(
            "You will navigate to the login page after 2 seconds to login.",
            {
              position: "bottom-center",
              duration: 1500,
              style: {
                backgroundColor: "black",
                color: "white",
                width: "fit-content",
              },
            }
          );
  
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        //  * 3 - Rejected => FAILED => (OPTIONAL)
        console.log(error);
        const errorObj = error as AxiosError<IAxiosErrResponse>;
        // console.log(error);
        toast.error(`${errorObj.response?.data.error.message}`, {
          position: "bottom-center",
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    // Renders
    const renderRegisterForm = RegisterForm.map(
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
          Register to get access!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {renderRegisterForm}
          <button className="w-full text-2xl text-white font-semibold bg-indigo-700 hover:bg-indigo-500 p-2">
          {isLoading ? "Loading..." : "Register"}
         </button>
        </form>
      </div>
    );
  };

export default Register;