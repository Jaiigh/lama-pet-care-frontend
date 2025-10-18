import { type Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register | LAMA",
  description: "Register Page",
};

export default function Register() {
  return (
    <>
      <RegisterForm />
    </>
  );
}
