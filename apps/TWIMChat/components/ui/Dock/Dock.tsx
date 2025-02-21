"use client";

import React, { forwardRef } from "react";
import { CalendarIcon, HomeIcon, MailIcon, PencilIcon, LogOut } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/misc/button";
import { Separator } from "@/components/ui/misc/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/misc/tooltip";
import { cn } from "@/utils/cn";
import { Dock, DockIcon } from "@/components/ui/misc/dock";

export type IconProps = React.HTMLAttributes<SVGElement>;

// Updated type: href and onClick are now optional.
export type NavItem = {
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.FC<IconProps>;
  label: string;
};

export type DockElementProps = React.HTMLAttributes<HTMLDivElement> & {
  navItems?: NavItem[];
};

const Icons = {
  calendar: (props: IconProps) => <CalendarIcon {...props} />,
  email: (props: IconProps) => <MailIcon {...props} />,
  x: (props: IconProps) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>X</title>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  ),
  youtube: (props: IconProps) => (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>youtube</title>
      <path d="M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z" />
    </svg>
  ),
};

const DATA = {
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home", onClick: undefined },
  ],
  contact: {
    social: {
      Youtube: {
        name: "YouTube",
        url: "https://www.youtube.com/@theworldismindbybolt",
        icon: Icons.youtube,
      },
    },
  },
  session: {
    actions: {
      logout: {
          label: "Se déconnecter",
          icon: LogOut,
          href: "/api/auth/signout",
        },
    },
  },
};

function DockElementImpl(
  { navItems, ...props }: DockElementProps,
  ref: React.Ref<HTMLDivElement>
) {
  // Use provided navItems or fallback to default DATA.navbar.
  const currentList = navItems || DATA.navbar;
  return (
    <TooltipProvider>
      <Dock direction="middle" {...props} ref={ref}>
        {currentList.map((item) => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <item.icon className="size-4" />
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social).map(([name, social]) => (
          <DockIcon key={name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={social.url}
                  aria-label={social.name}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <social.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.session.actions).map(([name, action]) => (
          <DockIcon key={name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={action.href!}
                  aria-label={action.label}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full"
                  )}
                >
                  <action.icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
      </Dock>
    </TooltipProvider>
  );
}

export const DockElement = forwardRef<HTMLDivElement, DockElementProps>(
  DockElementImpl
);