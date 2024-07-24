"use client";
import { signOut } from "next-auth/react";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      Hello homepage!!!
      <div
        className="cursor-pointer"
        onClick={() => {
          signOut();
        }}
      >
        Logout
      </div>
    </div>
  );
}
