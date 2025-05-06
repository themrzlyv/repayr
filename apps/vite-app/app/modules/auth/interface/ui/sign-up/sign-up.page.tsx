import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";

import {
  signInFormSchema,
  type SignInFormSchemaType,
} from "../../schema/sign-in-form.schema";

import { GoogleIcon } from "~/assets/icons";
import { useSignInUserMutation } from "~/modules/auth/infra/auth.api";

export function SignUpPage() {
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

  return (
    <div className=" w-full h-full flex items-center justify-center">
      <div className="w-2/5 py-10 bg-white rounded-md border border-slate-300  flex flex-col  justify-center gap-10">
        <div className="flex mx-auto flex-col w-5/6 ">
          <h1 className="text-2xl font-bold mb-10">Join Repayr</h1>

          <button className="flex items-center mb-4 justify-center gap-2 border  border-slate-200 text-slate-500 text-sm font-medium py-2  rounded-md">
            <GoogleIcon className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center mb-4">
            <hr className="flex-1 text-slate-100" />
            <span className="text-sm text-slate-500 font-medium px-2">OR</span>
            <hr className="flex-1 text-slate-100" />
          </div>

          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col bg-gray-100 hover:bg-gray-200 transform transition-all duration-300 rounded-xl py-2 px-3">
                <label
                  htmlFor="name"
                  className="text-sm text-slate-500 font-medium"
                >
                  Your Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  name="name"
                  placeholder="your name"
                  className="w-full text-sm placeholder:italic focus:outline-none"
                />
              </div>

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
            <div className="flex flex-col gap-4">
              <button
                className=" bg-lime-300 text-black cursor-pointer  rounded-md py-2"
                type="submit"
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </button>
              <p className="text-sm text-center text-slate-500">
                Already have an account?{" "}
                <NavLink
                  to="/sign-in"
                  className="text-blue-500 hover:underline"
                >
                  Sign In
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
