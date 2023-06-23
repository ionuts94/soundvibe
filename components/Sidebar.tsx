"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi"
import { BiSearch } from "react-icons/bi"
import { SidebarItem } from "./SidebarItem";
import { Library } from "./Library";
import { Box } from "./Box";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathName = usePathname();

  const routes = useMemo(() => [
    {
      icon: HiHome,
      label: "Home",
      active: pathName !== "/search",
      href: "/"
    },
    {
      icon: BiSearch,
      label: "Search",
      active: pathName === "/search",
      href: "/search"
    }
  ], [pathName])

  return (
    <div className="flex h-full">
      <div
        className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2"
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map(item => (
              <SidebarItem
                key={item.label}
                {...item}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-auto py-2">
        {children}
      </main>
    </div>
  )
}