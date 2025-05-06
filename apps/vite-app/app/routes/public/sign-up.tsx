import { SignUpPage } from "~/modules/auth/interface/ui/sign-up/sign-up.page";

export function meta() {
  return [
    { title: "Sign Up page" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SignUp() {
  return (
    <>
      <SignUpPage />
    </>
  );
}
