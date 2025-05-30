import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  signInFormSchema,
  type SignInFormSchemaType,
} from "../../schema/sign-in-form.schema";

import { GoogleIcon } from "~/assets/icons";
import { useSignInUserMutation } from "~/modules/auth/infra/auth.api";

import {
  Button,
  Link,
  Input,
  Card,
  CardHeader,
  CardBody,
  Divider,
  CardFooter,
} from "@heroui/react";
import { ROUTES } from "~/routes";

export function SignUpPage() {
  const navigate = useNavigate();
  const [signInMutation, { isLoading }] = useSignInUserMutation();

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInFormSchemaType) => {
    signInMutation(data)
      .unwrap()
      .then(() => {
        navigate("/account/dashboard");
      })
      .catch((error) => {
        console.log("Error signing in:", error);
      });
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const loginWindow = window.open(
      "http://localhost:8000/auth/google",
      "google-login",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    const listener = (event: MessageEvent) => {
      if (event.data === "google-auth-success") {
        loginWindow?.close();
        window.removeEventListener("message", listener);
        navigate("/account/dashboard");
      }

      if (
        typeof event.data === "object" &&
        event.data?.type === "google-auth-error"
      ) {
        loginWindow?.close();
        window.removeEventListener("message", listener);
        const errorMsg = decodeURIComponent(event.data.message);
        alert(errorMsg);
      }
    };

    window.addEventListener("message", listener);
  };

  return (
    <div className="w-full min-h-full bg-pattern px-24 py-5 flex items-center justify-center">
      <Card
        isBlurred
        shadow="sm"
        className="border-0 p-5 w-2/5 bg-background/60 dark:bg-default-100/50 "
      >
        <CardHeader className="flex flex-col gap-6">
          <h2 className="text-2xl text-left font-sansation font-medium ">
            Join us!
          </h2>
          <Button variant="bordered" fullWidth onClick={handleGoogleLogin}>
            <GoogleIcon className="w-4 h-4" />
            Sign up with Google
          </Button>
        </CardHeader>
        <Divider className="my-4" />

        <CardBody>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <Input label="Email" placeholder="you@example.com" />
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />

              <Input label="Password" placeholder="******" />
            </div>
            <div className="flex flex-col gap-6">
              <Button isLoading={isLoading} color="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="mt-4">
          <p className="text-sm flex justify-center items-center gap-1 text-slate-500">
            You already have an account?
            <Link href={ROUTES.signIn} size="sm" underline="always">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
