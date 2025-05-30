import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";

import {
  signInFormSchema,
  type SignInFormSchemaType,
} from "../../schema/sign-in-form.schema";

import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Input,
  CardBody,
  Divider,
  Link,
} from "@heroui/react";

import { useAuthContext } from "../../use-auth-context";
import { GoogleIcon } from "@/app/assets/icons";
import { LogIn } from "lucide-react";

export function SignInPage() {
  const navigate = useNavigate();
  const { authAction, authStore } = useAuthContext();

  const { isLoading } = authStore.signIn;

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormSchemaType) => {
    await authAction.signIn(data);
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const loginWindow = window.open(
      "http://localhost:8000/auth/google",
      "google-login",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const listener = (event: MessageEvent) => {
      if (event.data === "google-auth-success") {
        loginWindow?.close();
        window.removeEventListener("message", listener);
        navigate({ to: "/account/dashboard" });
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
    <div className="w-full px-24 py-5 flex flex-1 items-center justify-center">
      <Card className="border-0 p-5 w-2/5 bg-background/60 dark:bg-default-100/50 ">
        <CardHeader className="flex flex-col gap-6">
          <h6 className="text-2xl text-left font-sansation font-medium ">
            Welcome back!
          </h6>
          <Button
            variant="shadow"
            color="success"
            onClick={handleGoogleLogin}
            startContent={<GoogleIcon className="w-4 h-4" />}
          >
            Sign in with Google
          </Button>
        </CardHeader>

        <Divider className="my-4" />

        <CardBody>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <Input
                {...form.register("email")}
                placeholder="you@example.com"
                label="Email"
              />

              <Input
                {...form.register("password")}
                placeholder="******"
                label="Password"
              />
            </div>
            <Button
              color="primary"
              variant="solid"
              fullWidth
              endContent={<LogIn size={16} />}
              isLoading={isLoading}
              type="submit"
              className="mt-2"
            >
              Sign In
            </Button>
          </form>
        </CardBody>
        <CardFooter className="mt-4">
          <p className="text-sm flex justify-center items-center gap-1 text-slate-500">
            Dont have an account?
            <Link underline="always" size="sm" href="/sign-up">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
