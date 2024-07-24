import React from "react";
import { authOptions } from "@/lib/AuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ProtectedRootLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedRootLayout({
  children,
}: ProtectedRootLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <main
      className={cn("w-full flex mt-12", {
        "debug-screens": process.env.NODE_ENV === "development",
      })}
    >
      <Sidebar />
      {children}
    </main>
  );
}
