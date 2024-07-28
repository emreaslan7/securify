import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import PageTitle from "@/components/page-title";
import { cn } from "@/lib/utils";
import { TransactionsTable } from "@/components/transactions-table";
import { useSession } from "next-auth/react";
import { getCircleTransactionsList } from "@/data/circle/user-controlled/transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import truncateAddress from "@/helpers/truncateAddress";
import { getTimeAgo } from "@/helpers/getTimeAgo";
import { getCircleWalletsDEV } from "@/data/circle/developer-controlled/wallet";
import { getCircleWalletTransactionsDEV } from "@/data/circle/developer-controlled/transaction";

type Props = {};
type Payment = {
  order: string;
  status: string;
  lastOrder: string;
  method: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "txHash",
    header: "Transaction Hash",
  },
  {
    accessorKey: "blockchain",
    header: "Blockchain",
  },
  {
    accessorKey: "sourceAddress",
    header: "Source Address",
  },
  {
    accessorKey: "destinationAddress",
    header: "Destination Address",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "transactionType",
    header: "Transaction Type",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "amounts",
    header: "Amount",
  },
  {
    accessorKey: "createDate",
    header: "Date",
  },
];

const data: Payment[] = [
  {
    order: "ORD001",
    status: "Pending",
    lastOrder: "2023-01-15",
    method: "Credit Card",
  },
  {
    order: "ORD002",
    status: "Processing",
    lastOrder: "2023-02-20",
    method: "PayPal",
  },
  {
    order: "ORD003",
    status: "Completed",
    lastOrder: "2023-03-10",
    method: "Stripe",
  },
  {
    order: "ORD004",
    status: "Pending",
    lastOrder: "2023-04-05",
    method: "Venmo",
  },
  {
    order: "ORD005",
    status: "Completed",
    lastOrder: "2023-05-12",
    method: "Bank Transfer",
  },
  {
    order: "ORD006",
    status: "Processing",
    lastOrder: "2023-06-18",
    method: "Apple Pay",
  },
  {
    order: "ORD007",
    status: "Completed",
    lastOrder: "2023-07-22",
    method: "Google Pay",
  },
  {
    order: "ORD008",
    status: "Pending",
    lastOrder: "2023-08-30",
    method: "Cryptocurrency",
  },
  {
    order: "ORD009",
    status: "Processing",
    lastOrder: "2023-09-05",
    method: "Alipay",
  },
  {
    order: "ORD010",
    status: "Completed",
    lastOrder: "2023-10-18",
    method: "WeChat Pay",
  },
  {
    order: "ORD011",
    status: "Pending",
    lastOrder: "2023-11-25",
    method: "Square Cash",
  },
  {
    order: "ORD012",
    status: "Completed",
    lastOrder: "2023-12-08",
    method: "Zelle",
  },
  {
    order: "ORD013",
    status: "Processing",
    lastOrder: "2024-01-15",
    method: "Stripe",
  },
  {
    order: "ORD014",
    status: "Completed",
    lastOrder: "2024-02-20",
    method: "PayPal",
  },
  {
    order: "ORD015",
    status: "Pending",
    lastOrder: "2024-03-30",
    method: "Credit Card",
  },
];

export default async function OrdersPage({}: Props) {
  const session = await getServerSession(authOptions);
  let transactions: any;

  if (session?.user.custodyType === "END_USER") {
    transactions = await getCircleTransactionsList(
      session?.user.circleUserId as string,
      false
    );
  } else {
    const userWallets = await getCircleWalletsDEV(
      session?.user.circleUserId as string
    );
    transactions = await getCircleWalletTransactionsDEV(
      userWallets?.map((wallet: any) => wallet.id)
    );
  }

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Transactions" />
      <TransactionsTable
        columns={columns}
        data={transactions.map((transaction: any) => ({
          txHash: transaction.txHash
            ? truncateAddress(transaction.txHash)
            : "No Tx Hash",
          blockchain: transaction.blockchain,
          sourceAddress: transaction.sourceAddress,
          destinationAddress: transaction.destinationAddress,
          operation: transaction.operation,
          transactionType: transaction.transactionType,
          state: transaction.state,
          amounts: `$ ${transaction.amounts}`,
          createDate: getTimeAgo(transaction.createDate),
        }))}
      />
    </div>
  );
}
