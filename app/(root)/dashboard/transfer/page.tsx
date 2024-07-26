import PageTitle from "@/components/page-title";
import React from "react";
import Transfer from "@/components/transfer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import { getCircleWalletsList } from "@/data/circle/wallet";

export default async function TransferPage() {
  const session = await getServerSession(authOptions);

  const wallets = await getCircleWalletsList(
    session?.user?.circleUserId as string
  );
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Transfer" />
      <Transfer wallets={wallets} />
    </div>
  );
}
