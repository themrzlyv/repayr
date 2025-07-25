import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@heroui/react";

export const Route = createFileRoute("/_public/")({
  component: Home,
});

function Home() {
  return (
    <div className="w-full flex flex-col flex-1  px-[100px]">
      <div className="flex flex-1 h-full flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl text-center max-w-lg font-medium">
          Manage your finances easier than ever!
        </h1>
        <p className="text-slate-500 text-center text-md font-light max-w-lg">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum vitae
          repudiandae totam sed odio commodi amet nisi magnam.
        </p>
        <div className="flex items-center gap-4">
          <Button as={Link} to="/sign-in" color="warning">
            Get started
          </Button>
          <Link color="foreground" to="/about" className="hover:underline">
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
