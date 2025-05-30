import { NavLink } from "react-router";

import LaptopImage from "~/assets/laptop.jpg";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="h-[400vh] w-full px-[100px]">
      <div className="flex items-center pt-20">
        <div className="w-8/12  h-70 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold max-w-2xl">
              Repayr is a debt management tool that helps you manage your loans
              and repayments.
            </h1>
            <p className="text-slate-500 font-normal max-w-xl text-md">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem hic
              veniam incidunt accusantium iste debitis ad saepe rerum cumque
              vitae.
            </p>
          </div>
          <NavLink
            to="/sign-up"
            className="px-6 py-1 border w-max border-slate-300 text-slate-600 font-medium text-md  rounded-sm"
          >
            Join Now!
          </NavLink>
        </div>
        <div className="w-4/12  h-70 flex items-center justify-center">
          <img src={LaptopImage} alt="" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}
