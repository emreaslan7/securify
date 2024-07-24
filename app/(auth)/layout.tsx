// create layout

import { FlagIcon } from "lucide-react";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-black text-white p-12 flex flex-col justify-between">
        <div>
          <FlagIcon className="text-white h-6 w-6" />
          <h1 className="text-4xl font-bold mt-2">Acme Inc</h1>
        </div>
        <div>
          <p className="text-lg italic">
            This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before.
          </p>
          <p className="text-lg font-semibold mt-4">Sofia Davis</p>
        </div>
      </div>
      {children}
    </div>
  );
}
