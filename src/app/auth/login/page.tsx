import { type Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | LAMA",
  description: "Login Page",
};

export default function Login() {
  return (
    <>
      <LoginForm />
    </>
  );
}
