import * as yup from "yup"

export const Registerschema = yup
  .object({
    username: yup.string().required("username is required").min(5,"username should be at least 5 characters"),
    email:yup.string().required("email is required").matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,"Not valid email"),
    password:yup.string().required("password is required").min(8,"password should be at least 5 characters"),
  })

export const Loginschema = yup
  .object({
    identifier:yup.string().required("email is required").matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,"Not valid email"),
    password:yup.string().required("password is required").min(8,"password should be at least 5 characters"),
  })