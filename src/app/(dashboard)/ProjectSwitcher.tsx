"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectSwitcherItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface ProjectSwitcherProps {
  projects: ProjectSwitcherItem[];
}

export default function ProjectSwitcher({
  projects,
}: ProjectSwitcherProps) {
  const [selectedProject, setSelectedProject] = useState<string>(
    projects[0].id,
  );

  return (
    <Select defaultValue={selectedProject} onValueChange={setSelectedProject}>
      <SelectTrigger
        className="flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"
        aria-label="Select project"
      >
        <SelectValue placeholder="Select a project">
          {projects.find((project) =>
            project.id === selectedProject
          )?.icon}
          <span className="ml-2">
            {projects.find((project) => project.id === selectedProject)
              ?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {project.icon}
              {project.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
