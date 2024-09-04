import Link from "next/link";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  LucideIcon,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import ProjectSwitcher, { type ProjectSwitcherItem } from "./ProjectSwitcher";

export type NavItem =
  | {
    icon: LucideIcon;
    label?: string;
    title: string;
    url: string;
    variant: "default" | "ghost";
  }
  | "separator";

const LINKS: NavItem[] = [
  {
    icon: Inbox,
    label: "128",
    title: "Inbox",
    url: "#",
    variant: "default",
  },
  {
    icon: File,
    label: "9",
    title: "Drafts",
    url: "#",
    variant: "ghost",
  },
  {
    icon: Send,
    label: "",
    title: "Sent",
    url: "#",
    variant: "ghost",
  },
  {
    icon: ArchiveX,
    label: "23",
    title: "Junk",
    url: "#",
    variant: "ghost",
  },
  {
    icon: Trash2,
    label: "",
    title: "Trash",
    url: "#",
    variant: "ghost",
  },
  {
    icon: Archive,
    label: "",
    title: "Archive",
    url: "#",
    variant: "ghost",
  },
  "separator",
  {
    icon: Users2,
    label: "972",
    title: "Social",
    url: "#",
    variant: "ghost",
  },
  {
    icon: AlertCircle,
    label: "342",
    title: "Updates",
    url: "#",
    variant: "ghost",
  },
  {
    icon: MessagesSquare,
    label: "128",
    title: "Forums",
    url: "#",
    variant: "ghost",
  },
  {
    icon: ShoppingCart,
    label: "8",
    title: "Shopping",
    url: "#",
    variant: "ghost",
  },
  {
    icon: Archive,
    label: "21",
    title: "Promotions",
    url: "#",
    variant: "ghost",
  },
];

const PROJECTS: ProjectSwitcherItem[] = [
  {
    id: "main",
    label: "RustLangES",
  },
  {
    id: "forms",
    label: "Forms",
  }
];

export const metadata = {
  title: "RustLangES Dashboard"
};

export default function({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen min-h-dvh">
      <div className="sticky top-0 h-fit flex flex-col gap-4 py-2 w-72">
        <nav className="grid gap-1 px-2">
          <ProjectSwitcher projects={PROJECTS} />

          <Separator className="my-2" />

          {LINKS.map((link, index) =>
            link === "separator" ? <Separator /> : (
              <Link
                key={index}
                href={link.url}
                className={cn(
                  buttonVariants({ variant: link.variant, size: "sm" }),
                  link.variant === "default" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                  "justify-start",
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                        "text-background dark:text-white",
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            )
          )}
        </nav>
      </div>

      {children}
    </div>
  );
}
