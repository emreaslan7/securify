"use client";
import { ChevronsDown, Github, Menu } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import logo from "@/public/securify_logo.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const session = useSession();

  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <header className="shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card">
      <Link href="/" className="font-bold text-lg flex items-center">
        {/* <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" /> */}
        <Image src={logo} alt="Securify Logo" width={60} height={60} />
        <div className="text-lg ml-3">Securify</div>
      </Link>
      {/* <!-- Mobile --> */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src={logo}
                      alt="Securify Logo"
                      width={60}
                      height={60}
                    />
                    <div className="text-lg ml-3">Securify</div>
                  </Link>
                </SheetTitle>
              </SheetHeader>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />

              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:flex lg:space-x-3">
        <ToggleTheme />
        <Button asChild size="sm" variant="ghost" aria-label="View on GitHub">
          <Link
            aria-label="View on GitHub"
            href="https://github.com/nobruf/shadcn-landing-page.git"
            target="_blank"
          >
            <Github className="size-5" />
          </Link>
        </Button>

        {/* CREATE Sign in sign up buttons */}

        {session.data?.user ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              signOut();
            }}
          >
            <p>Logout</p>
          </Button>
        ) : (
          <>
            <Button asChild size="sm" variant="ghost" aria-label="Sign in">
              <Link aria-label="Sign in" href="/signin">
                Sign in
              </Link>
            </Button>

            <Button asChild size="sm" variant="default" aria-label="Sign up">
              <Link aria-label="Sign up" href="/signup">
                Sign up
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
