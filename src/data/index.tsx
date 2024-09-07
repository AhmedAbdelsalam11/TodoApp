import { IloginForm, IregisterForm } from "../interfaces";

 export const RegisterForm: IregisterForm[] =[
    {
        name:"username",
        type:"text",
        placeholder:"Username",
        validation:{
            required:true,
            minleangth:5,
        }
    },
    {
        name:"email",
        type:"email",
        placeholder:"Email",
        validation:{
            required:true,
           pattern:/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
        }
    },
    {
        name:"password",
        type:"password",
        placeholder:"Password",
        validation:{
            required:true,
            minleangth:8,
        }
    },
    
   
]


 export const LoginForm: IloginForm[] =[
    {
        name:"identifier",
        type:"email",
        placeholder:"Email",
        validation:{
            required:true,
           pattern:/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
        }
    },
    {
        name:"password",
        type:"password",
        placeholder:"Password",
        validation:{
            required:true,
            minleangth:8,
        }
    },
    
   
]