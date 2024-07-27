"use client";

import React, { useState } from "react";
import axios from "axios";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { SignupFormSchema } from "@/schemas/index";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { create_user_account } from "@/actions/user-controlled-wallets/createUser";
import useExecuteChallenge from "@/hooks/useExecuteChallenge";

import { Label } from "./ui/label";
import {
  create_wallet_set,
  create_wallet,
} from "@/actions/developer-contolled-wallets";

export const SignUpForm = () => {
  const { executeChallenge, error, result } = useExecuteChallenge();

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      custodyType: "END_USER",
    },
  });

  if (session.data) {
    router.back();
  }

  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    // setLoading(true);

    console.log("values:", values);
    if (values.custodyType === "DEVELOPER") {
      try {
        const walletSet = await create_wallet_set(values.name);
        console.log("walletSet:", walletSet);

        const wallet = await create_wallet(walletSet?.id || "", values.name);

        await axios.post("/api/register", {
          name: values.name,
          circleUserId: walletSet?.id,
          custodyType: values.custodyType,
          email: values.email,
          password: values.password,
        });
        toast.success("Account created successfully");
        router.push("/signin");
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await create_user_account();
        if (!response) return;
        if (
          !response.userToken ||
          !response.encryptionKey ||
          !response.challengeId
        ) {
          console.error("Missing userToken, encryptionKey or challengeId");
          return;
        }
        const result = executeChallenge(
          response.userToken,
          response.encryptionKey,
          response.challengeId
        );
        if (!result) return;
        await axios.post("/api/register", {
          name: values.name,
          circleUserId: response.userId,
          email: values.email,
          password: values.password,
        });
        toast.success("Account created successfully");
        router.push("/signin");
      } catch (error: any) {
        toast.error(error?.response?.data || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="w-1/2 bg-white p-12 flex flex-col justify-center ">
      <div className="w-[400px] mx-auto text-black">
        <h2 className="text-3xl font-bold text-gray-500">Create an Account</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="johndoe"
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
            <FormField
              control={form.control}
              name="custodyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custody Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="END_USER" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          User Controlled Account
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="DEVELOPER" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Developer Contolled Account
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center flex-col mt-3">
              <Button variant={"link"} className="p-0">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-600"
                  prefetch={false}
                >
                  <p className="text-sm text-center font-light">
                    Already have an account? Sign in
                  </p>
                </Link>
              </Button>
              <Button type="submit" className="w-full mb-4" disabled={loading}>
                Create an Account
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-xs text-gray-500 mt-4">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </div>
  );
};
function executeChallenge(
  userToken: string,
  encryptionKey: string,
  challengeId: any
) {
  throw new Error("Function not implemented.");
}
