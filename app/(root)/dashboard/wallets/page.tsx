import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import PageTitle from "@/components/page-title";
import { getCircleWallet, getCircleWalletsList } from "@/data/circle/wallet";
import truncateAddress from "@/helpers/truncateAddress";
import { getTimeAgo } from "@/helpers/getTimeAgo";
import { NewWalletDialog } from "@/components/new_wallet_dialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

type Props = {};
type Payment = {
  id: string;
  network: string;
  accountType: string;
  createDate: string;
  state: string;
  name: string;
  refId: string;
  address: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Wallet ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "refId",
    header: "Ref Id",
  },
  {
    accessorKey: "network",
    header: "Network",
  },

  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
  },

  {
    accessorKey: "state",
    header: "State",
  },

  {
    accessorKey: "createDate",
    header: "Create Date",
  },
];

export default async function WalletsPage({}: Props) {
  const session = await getServerSession(authOptions);

  // const wallet = await getCircleWallet(
  //   "473b0e76-19a5-43c0-8bed-7d851a4ee9da",
  //   "b9870113-a70c-58ba-b39d-37797ca66cad"
  // );
  // const wallets = await getCircleWalletsList(
  //   "de00db2b-b9e2-4049-934c-e0a90eee3020"
  // );
  const wallets = await getCircleWalletsList(
    session?.user?.circleUserId as string
  );

  return (
    <div className="flex flex-col gap-5  w-full px-4">
      <div className="flex items-center justify-between">
        <PageTitle title="Wallets" />
        <NewWalletDialog />
      </div>
      <DataTable
        columns={columns}
        data={wallets.map((wallet: any) => ({
          id: truncateAddress(wallet.id),
          network: wallet.blockchain,
          accountType: wallet.accountType,
          createDate: getTimeAgo(wallet.createDate),
          state: wallet.state,
          name: wallet.name,
          refId: wallet.refId,
          address: truncateAddress(wallet.address),
        }))}
      />
    </div>
  );
}
