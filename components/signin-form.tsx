"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { LoginFormSchema } from "@/schemas/index";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

import { useSession } from "next-auth/react";

export const SignInForm = () => {
  const router = useRouter();

  const session = useSession();
  if (session.data) {
    router.back();
  }

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true);

    const login = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (login?.ok) {
      toast.success("Logged in successfully");
      window.location.assign("/dashboard");
    } else if (login?.error) {
      toast.error(login.error);
    }

    setLoading(false);
  }

  return (
    <div className="w-1/2 bg-white p-12 flex flex-col justify-center ">
      <div className="w-[400px] mx-auto">
        <h2 className="text-3xl font-bold text-gray-500">Welcome Back</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="johndoe@gmail.com"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center flex-col">
              <Button variant={"link"} className="p-0">
                <Link
                  href="/signup"
                  className="text-sm font-medium text-gray-600"
                  prefetch={false}
                >
                  <p className="text-sm text-center font-light">
                    {"Don't have an account? Sign up"}
                  </p>
                </Link>
              </Button>
              <Button
                type="submit"
                className="w-full mt-2 mb-4"
                disabled={loading}
              >
                Log In
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
