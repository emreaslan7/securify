"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useExecuteChallenge from "@/hooks/useExecuteChallenge";
import { create_wallet } from "@/actions/createWallet";
import { useSession } from "next-auth/react";

export function NewWalletDialog() {
  const session = useSession();

  // use useExecuteChallenge hook
  const { executeChallenge, loading, error, result } = useExecuteChallenge();

  const [formError, setFormError] = useState("");

  const [name, setName] = useState("wallet001");
  const [refId, setRefId] = useState("ref001");
  const [blockchain, setBlockchain] = useState("");
  const [accountType, setAccountType] = useState("EOA");

  const handleSubmit = async () => {
    if (name === "" || refId === "" || blockchain === "" || accountType === "")
      return setFormError("Please fill all fields");

    if (accountType === "SCA" && blockchain === "AVAX-FUJI") {
      return setFormError("SCA is not supported for AVAX-FUJI");
    }

    const response = await create_wallet(
      session.data?.user.circleUserId as string,
      name,
      refId,
      blockchain,
      accountType
    );
    if (!response) return;

    const responseExecute = executeChallenge(
      response.userToken,
      response.encryptionKey,
      response.challengeId
    );

    if (!result) return;
    setFormError("");

    window.location.reload();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Wallet</DialogTitle>
          <DialogDescription>
            Create a new wallet to store your assets.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Wallet Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="refId" className="text-right">
              Referans Id
            </Label>
            <Input
              id="refId"
              placeholder="Enter your refId"
              value={refId}
              disabled={loading}
              onChange={(e) => setRefId(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div></div>
            <div className="col-span-3">
              <Select onValueChange={(value) => setBlockchain(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose Blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Networks</SelectLabel>
                    <SelectItem value="MATIC-AMOY">MATIC-AMOY</SelectItem>
                    <SelectItem value="AVAX-FUJI">AVAX-FUJI</SelectItem>
                    <SelectItem value="ETH-SEPOLIA">ETH-SEPOLIA</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="refId" className="text-right">
              Account Type
            </Label>
            <div className="col-span-3 flex justify-center">
              <RadioGroup
                className="flex items-center justify-center"
                value={accountType}
                onValueChange={(value) => setAccountType(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EOA" id="r1" />
                  <Label htmlFor="r1">EOA</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SCA" id="r2" />
                  <Label htmlFor="r2">SCA</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {formError && (
          <p className="text-red-500 text-end w-full">{formError}</p>
        )}

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
