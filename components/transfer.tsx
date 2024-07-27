"use client";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "./ui/input";
import Image from "next/image";
import sendMoney from "@/public/send-money.png";
import { Button } from "./ui/button";
import { CircleHelp } from "lucide-react";
import truncateAddress from "@/helpers/truncateAddress";
import Polygon from "@/public/blockchain/polygon.png";
import Ethereum from "@/public/blockchain/ethereum.png";
import Avalance from "@/public/blockchain/avalanche.png";
import { initialize_transfer } from "@/actions/user-controlled-wallets/initiaze_transfer";
import useExecuteChallenge from "@/hooks/useExecuteChallenge";
import { getCircleTransactionsList } from "@/data/circle/transactions";
import { AlertCircle, CircleCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import usdcIcon from "@/public/blockchain/usdc.png";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCircleTokenBalances } from "@/data/circle/wallet";

interface TransferProps {
  wallets: any;
}

export default function Transfer({ wallets }: TransferProps) {
  const { executeChallenge, error } = useExecuteChallenge();

  const [formError, setFormError] = useState("");
  const [txDetails, setTxDetails] = useState<any>();

  const [fromAccount, setFromAccount] = useState<any>();
  const [toAccount, setToAccount] = useState<any>();
  const [toAddress, setToAddress] = useState("");

  const [amount, setAmount] = useState(0);

  const getTransferDetails = async () => {
    const transactions = await getCircleTransactionsList(
      fromAccount.userId,
      false
    );
    return transactions[0];
  };

  const handleSubmit = async () => {
    setTxDetails(null);

    if (amount === 0 || !amount) {
      setFormError("Please enter an amount to transfer");
      return;
    }
    if (!fromAccount) {
      setFormError("Please select an account to transfer");
      return;
    }
    if (!toAccount && !toAddress) {
      setFormError("Please select an account or enter an address to transfer");
      return;
    }
    const destinationAddress = toAddress ? toAddress : toAccount.address;
    if (fromAccount.address === destinationAddress) {
      setFormError("You can't transfer to the same address.");
      return;
    }

    const fromAccountBalance = await getCircleTokenBalances(
      fromAccount.userId,
      fromAccount.id
    );
    if (fromAccountBalance < amount) {
      setFormError("You don't have enough balance to transfer this amount.");
      return;
    }

    if (fromAccount.blockchain !== toAccount.blockchain) {
      setFormError("You can't transfer between different blockchains.");
      return;
    }

    const response = await initialize_transfer(
      fromAccount.userId,
      amount.toString(),
      destinationAddress,
      "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
      fromAccount.walletId,
      fromAccount.blockchain
    );

    if (!response) {
      setFormError("Failed to initialize transfer");
      return;
    }

    const { userToken, encryptionKey, challengeId, userId } = response;

    const challengeResponse = await executeChallenge(
      userToken,
      encryptionKey,
      challengeId
    );

    if (!challengeResponse) {
      setFormError("Failed to execute transfer");
      return;
    }

    const lastTx = await getTransferDetails();
    setTxDetails(lastTx);

    setFormError("");
    return;
  };

  return (
    <div className="flex items-center justify-center">
      <div className=" shadow-lg rounded-lg p-5 border-orange-600 border-2 flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-center">Transfer</h2>
        <p className="text-gray-500 text-center mb-2">
          Transfer money to another account.
        </p>
        <div className="w-[1000px] flex items-center justify-between gap-4 mb-4">
          <div>
            <Tabs
              onValueChange={(value) => setFromAccount(value)}
              className="w-[300px]"
            >
              <TabsList className="flex flex-col w-full h-full gap-y-2 ">
                <ScrollArea className="w-full h-[250px]">
                  {wallets.map((wallet: any) => (
                    <TabsTrigger
                      key={wallet.id}
                      className="w-full py-3 data-[state=active]:bg-orange-600"
                      value={wallet}
                    >
                      <div className="w-full">
                        <p>
                          {wallet.name} ({truncateAddress(wallet.address)})
                        </p>
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                wallet.blockchain === "MATIC-AMOY"
                                  ? Polygon
                                  : wallet.blockchain === "ETH-SEPOLIA"
                                  ? Ethereum
                                  : Avalance
                              }
                              alt={wallet.blockchain}
                              width={16}
                              height={16}
                            />
                            <p className="text-xs">{wallet.blockchain}</p>
                          </div>
                          <div>
                            <p className="text-xs">{wallet.accountType}</p>
                          </div>
                        </div>
                        <div className="flex items-end justify-center">
                          <Image
                            src={usdcIcon}
                            alt="usdc"
                            width={16}
                            height={16}
                          />
                          <span className="text-xs ml-1">
                            {wallet.balance ? wallet.balance : "0"}
                          </span>
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </ScrollArea>
              </TabsList>
            </Tabs>
            <div className="text-xs font-thin whitespace-nowrap flex items-center mt-2">
              <CircleHelp
                className="inline-block text-orange-600 mr-2"
                height={16}
                width={16}
              />
              <span>Select the account you want to transfer from</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between">
              <Image
                src={sendMoney}
                alt="send money"
                width={100}
                height={100}
              />
              <p className="text-xs ">
                Transfer $USDC <span className="font-bold">directly!</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-thin whitespace-nowrap">
                Enter the amount you want to transfer
              </p>
              <Input
                className="bg-[#292524] mt-2 border-b-2 border-orange-600 text-white"
                placeholder="$100"
                type="number"
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                }}
              />
            </div>
          </div>
          <div>
            <Tabs
              defaultValue="account"
              onValueChange={(value) => setToAccount(value)}
              className="w-[300px]"
            >
              <TabsList className="flex flex-col w-full h-full gap-y-2 ">
                <ScrollArea className="w-full h-[250px]">
                  {wallets.map((wallet: any) => (
                    <TabsTrigger
                      key={wallet.id}
                      className="w-full py-3 data-[state=active]:bg-orange-600"
                      value={wallet}
                    >
                      <div className="w-full">
                        <p>
                          {wallet.name} ({truncateAddress(wallet.address)})
                        </p>
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={
                                wallet.blockchain === "MATIC-AMOY"
                                  ? Polygon
                                  : wallet.blockchain === "ETH-SEPOLIA"
                                  ? Ethereum
                                  : Avalance
                              }
                              alt={wallet.blockchain}
                              width={16}
                              height={16}
                            />
                            <p className="text-xs">{wallet.blockchain}</p>
                          </div>
                          <div>
                            <p className="text-xs">{wallet.accountType}</p>
                          </div>
                        </div>
                        <div className="flex items-end justify-center">
                          <Image
                            src={usdcIcon}
                            alt="usdc"
                            width={16}
                            height={16}
                          />
                          <span className="text-xs ml-1">
                            {wallet.balance ? wallet.balance : "0"}
                          </span>
                        </div>
                      </div>
                    </TabsTrigger>
                  ))}
                </ScrollArea>
              </TabsList>
            </Tabs>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <Input
              className="bg-[#292524] mt-2 border-b-2 border-orange-600 text-white"
              placeholder="0xabcdef1234..."
              type="text"
              onChange={(e) => {
                setToAddress(e.target.value);
              }}
            />
            <div className="text-xs font-thin flex items-center mt-2 w-[300px]">
              <CircleHelp
                className="inline-block text-orange-600 mr-2"
                height={16}
                width={16}
              />
              <p className="whitespace-pre-wrap">
                You can send funds directly to your own wallets or to another
                address.
              </p>
            </div>
          </div>
        </div>
        {formError && (
          <div className="bg-red-500 text-white p-2 rounded-md w-[1000px] text-center">
            {formError}
          </div>
        )}
        {txDetails && txDetails.state === "FAILED" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {txDetails.errorReason}: {txDetails.errorDetails}
            </AlertDescription>
          </Alert>
        )}

        {txDetails && txDetails.state !== "FAILED" && (
          <Alert variant="default" className="border-green-500 border-2">
            <CircleCheck className="h-4 w-4" fill="#22c55e" />
            <AlertTitle className="text-green-500">Success</AlertTitle>
            <AlertDescription>
              Your transaction was completed successfully.
              {txDetails.transactionHash}
            </AlertDescription>
          </Alert>
        )}

        <Button className="my-5" onClick={handleSubmit}>
          Start USDC Transfer
        </Button>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What happens if I transfer USDC using my SCA wallet?
            </AccordionTrigger>
            <AccordionContent>
              You can transfer USDC without having a native token. Gas fee is
              covered by us.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Why am I not able to transfer to a different blockchain?
            </AccordionTrigger>
            <AccordionContent>
              We have not activated the Cross Chain Payment Protocol - CCTP yet.
              Stay tuned!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
