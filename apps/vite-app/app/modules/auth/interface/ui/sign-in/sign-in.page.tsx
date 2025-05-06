import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";

import {
  signInFormSchema,
  type SignInFormSchemaType,
} from "../../schema/sign-in-form.schema";

import { GoogleIcon } from "~/assets/icons";
import { useSignInUserMutation } from "~/modules/auth/infra/auth.api";
import { Button } from "~/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/ui/card";

export function SignInPage() {
  const navigate = useNavigate();
  const [signInMutation, { isLoading }] = useSignInUserMutation();

  const { register, handleSubmit } = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
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
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className=" w-full h-full flex items-center justify-center">
      <Card className="w-2/5 py-10 bg-white rounded-md border border-slate-300  flex flex-col  justify-center gap-10">
        <CardHeader className="">
          <CardTitle className="text-2xl font-bold mb-10">
            Welcome back!
          </CardTitle>
          <CardDescription>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="w-4 h-4" />
              Continue with Google
            </Button>

            <div className="flex items-center my-4">
              <hr className="flex-1 text-slate-100" />
              <span className="text-sm text-slate-500 font-medium px-2">
                OR
              </span>
              <hr className="flex-1 text-slate-100" />
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col bg-gray-100 hover:bg-gray-200 transform transition-all duration-300 rounded-xl py-2 px-3">
                <label
                  htmlFor="email"
                  className="text-sm text-slate-500 font-medium"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="text"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full text-sm placeholder:italic focus:outline-none"
                />
              </div>

              <div className="flex flex-col bg-gray-100 hover:bg-gray-200 transform transition-all duration-300 rounded-xl py-2 px-3">
                <label
                  htmlFor="password"
                  className="text-sm text-slate-500 font-medium"
                >
                  Password
                </label>
                <input
                  {...register("password")}
                  type="text"
                  name="password"
                  placeholder="********"
                  className="w-full text-sm placeholder:italic focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit">
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-slate-500">
                Dont have an account?
                <Button asChild variant="link" className="px-1">
                  <NavLink to="/sign-up">Sign Up</NavLink>
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
