import { SignInPage } from "~/modules/auth/interface/ui/sign-in/sign-in.page";

export function meta() {
  return [
    { title: "Sign in page" },
    { name: "description", content: "Sign in " },
  ];
}

export default function SignIn() {
  return (
    <>
      <SignInPage />
    </>
  );
}
