import { writable } from "svelte/store";

export type NavItem =
  | {
    badge?: string;
    href: string;
    label: string;
  }
  | "separator";

export interface Navbar {
  selectedProject: string;
  links: NavItem[];
}

export let navbar = writable<Navbar>({
  selectedProject: "RustLangES",
  links: [],
});

export function loadNavbar(
  links: NavItem[],
  selectedProject = "RustLangES",
): { navbar: Navbar } {
  navbar.update((v) => {
    v.selectedProject = selectedProject;
    v.links = links;
    return v;
  });

  return {
    navbar: { links, selectedProject },
  };
}

export function receiveNavbar(data: unknown) {
  if (typeof data === "object" && data !== null && "navbar" in data) {
    navbar.set(data.navbar as Navbar);
  }
}
