"use client";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  approve_usdc,
  burn_usdc,
  mint_usdc,
} from "@/actions/developer-contolled-wallets/cctp";

type Props = {};

interface Setting {
  category: string;
  value: string | number | boolean;
}

const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];
const data: Setting[] = [
  {
    category: "Account",
    value: true,
  },
  {
    category: "Notifications",
    value: false,
  },
  {
    category: "Language",
    value: "English",
  },
  {
    category: "Theme",
    value: "Dark",
  },
];

export default function SettingsPage({}: Props) {
  const senderWalletId = "93692650-824a-57f6-b583-f7733cb5d513"; //içinde 3.15 usdc olan wallet amoy
  const senderWalletAddress = "0x3ef7752bd54efd8667e2d502743022eb3dcee69b";

  const receiverWalletId = "60ae310b-d7e1-5e89-a479-8c4b95494f3b"; // 0 usdc olan wallet sepolia
  const receiverWalletAddress = "0x3ef7752bd54efd8667e2d502743022eb3dcee69b";

  const handleCCTP = async () => {
    // await approve_usdc(senderWalletId);
    // const burnId = await burn_usdc(senderWalletId, receiverWalletAddress);
    // console.log("burnId: ", burnId);
    // await mint_usdc(receiverWalletId, "56e3ee81-49f0-5b16-bda0-849a7568f00b");
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Settings" />
      <Button
        onClick={() => {
          handleCCTP();
        }}
      >
        CCTP
      </Button>
      {/* <DataTable columns={columns} data={data} /> */}
    </div>
  );
}
