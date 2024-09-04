import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  return (
    <div className="w-full h-[200vh]">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">Inbox</h1>
      </div>
      <Separator />
    </div>
  );
}
