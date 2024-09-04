"use client"

import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
// import { AccountSwitcher } from "./Switcher"
import { Nav } from "./Nav"

interface MailProps {
  // accounts: {
  //   label: string
  //   email: string
  //   icon: React.ReactNode
  // }[]
  // // mails: Mail[]
  // defaultLayout: number[] | undefined
  // defaultCollapsed?: boolean
  // navCollapsedSize: number
}

export function Mail() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div>
      <TooltipProvider delayDuration={0}>
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Inbox",
              label: "128",
              icon: Inbox,
              variant: "default",
            },
            {
              title: "Drafts",
              label: "9",
              icon: File,
              variant: "ghost",
            },
            {
              title: "Sent",
              label: "",
              icon: Send,
              variant: "ghost",
            },
            {
              title: "Junk",
              label: "23",
              icon: ArchiveX,
              variant: "ghost",
            },
            {
              title: "Trash",
              label: "",
              icon: Trash2,
              variant: "ghost",
            },
            {
              title: "Archive",
              label: "",
              icon: Archive,
              variant: "ghost",
            },
          ]}
        />
        <Separator />
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Social",
              label: "972",
              icon: Users2,
              variant: "ghost",
            },
            {
              title: "Updates",
              label: "342",
              icon: AlertCircle,
              variant: "ghost",
            },
            {
              title: "Forums",
              label: "128",
              icon: MessagesSquare,
              variant: "ghost",
            },
            {
              title: "Shopping",
              label: "8",
              icon: ShoppingCart,
              variant: "ghost",
            },
            {
              title: "Promotions",
              label: "21",
              icon: Archive,
              variant: "ghost",
            },
          ]}
        />
      </TooltipProvider >
    </div>
  )
}
