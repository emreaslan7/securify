"use client";
import React, { useEffect, useState } from "react";
import { Nav } from "@/components/ui/nav";
import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  ArrowLeftRightIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "./button";

import { useWindowWidth } from "@react-hook/window-size";

type Props = {};

export default function Sidebar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Initialize mobileWidth based on a reasonable default for SSR
  const [mobileWidth, setMobileWidth] = useState(true);

  useEffect(() => {
    // Adjust mobileWidth based on actual window width after component mounts
    const handleResize = () => {
      setMobileWidth(window.innerWidth < 768);
    };

    // Check immediately in case the initial state is incorrect
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            variant="secondary"
            className="rounded-full p-2"
            onClick={toggleSidebar}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Wallets",
            href: "/dashboard/wallets",
            icon: WalletIcon,
            variant: "ghost",
          },
          {
            title: "Transactions",
            href: "/dashboard/transactions",
            icon: ArrowLeftRightIcon,
            variant: "ghost",
          },
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
