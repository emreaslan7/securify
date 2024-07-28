// create layout

import React from "react";
import logo from "@/public/securify_logo.png";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-black text-white p-12 flex flex-col justify-between">
        <div className=" flex items-center justify-start gap-x-6">
          <Image src={logo} alt="Securify Logo" width={80} height={80} />

          <h1 className="text-2xl mt-2">Securify</h1>
        </div>
        <div>
          <p className="text-lg italic">
            Discover the benefits of our innovative platform and revolutionize
            the way you manage your finances.
          </p>
          <p className="text-lg font-semibold mt-4">Emre Aslan</p>
        </div>
      </div>
      {children}
    </div>
  );
}
