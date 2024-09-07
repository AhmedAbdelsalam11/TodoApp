export interface IregisterForm {
    name:"username" | "email" | "password";
    type:string;
    placeholder:string;
    validation:{
        required?:boolean;
        minleangth?:number;
        pattern?:RegExp
    }
};


export interface IloginForm {
    name:"identifier" | "password";
    type:string;
    placeholder:string;
    validation:{
        required?:boolean;
        minleangth?:number;
        pattern?:RegExp
    }
};


export interface IAxiosErrResponse {
    error:{
        details?:{
            errors:{
                message:string;
            }[];
        };
        message?:string;
    };
    
}