import BarChart from "@/components/bar-chart";
import PageTitle from "@/components/page-title";
import Card, { CardContent, CardProps } from "@/components/card";
import {
  WalletIcon,
  CreditCard,
  DollarSign,
  ArrowLeftRightIcon,
} from "lucide-react";
import LastTransactions from "@/components/last-transactions";
import {
  getCircleAllTokenBalances,
  getCircleAllWalletBalances,
  getCircleTokenBalances,
  getCircleWallet,
  getCircleWalletsList,
  updateCircleWallet,
} from "@/data/circle/user-controlled/wallet";
import {
  getCircleWalletsDEV,
  getCircleAllTokenBalancesDEV,
  getCircleWalletsBalancesDEV,
} from "@/data/circle/developer-controlled/wallet";
import { getCircleWalletTransactionsDEV } from "@/data/circle/developer-controlled/transaction";
import { getCircleTransactionsList } from "@/data/circle/user-controlled/transactions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

const cardData: CardProps[] = [
  {
    label: "Total Balances",
    amount: "$45,231.89",
    discription: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    label: "Transactions",
    amount: "+2350",
    discription: "+180.1% from last month",
    icon: ArrowLeftRightIcon,
  },
  {
    label: "Wallet Count",
    amount: "12",
    discription: "+20.1% from last month",
    icon: WalletIcon,
  },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  console.log("session:", session?.user);
  let userWallets: any;
  let totalBalance: any;
  let transactions: any;
  let TokenBalancesUsdcForChart: any;

  if (session?.user.custodyType === "END_USER") {
    userWallets = await getCircleWalletsList(
      session?.user.circleUserId as string
    );
    cardData[2].amount = `${userWallets.length.toString()}`;

    totalBalance = await getCircleAllTokenBalances(
      session?.user.circleUserId as string
    );
    cardData[0].amount = `${totalBalance.toString()} $`;

    transactions = await getCircleTransactionsList(
      session?.user.circleUserId as string,
      true
    );
    cardData[1].amount = `+${transactions.length.toString()}`;

    TokenBalancesUsdcForChart = await getCircleAllWalletBalances(
      session?.user.circleUserId as string
    );
  } else {
    // fetch developer controlled wallets
    userWallets = await getCircleWalletsDEV(
      session?.user.circleUserId as string
    );
    cardData[2].amount = `${userWallets.length.toString()}`;

    // fetch total balance of all wallets
    totalBalance = await getCircleAllTokenBalancesDEV(
      session?.user.circleUserId as string
    );
    cardData[0].amount = `${totalBalance.toString()} $`;

    // aşağıdaki fonksiyonun içine userWALLETS[i].id yazılmalı ARRAY ŞEKLİNDE İD'lER GİTMELİ WALLET ıD'leri
    // ['id1', 'id2', 'id3'] gibi
    transactions = await getCircleWalletTransactionsDEV(
      userWallets.map((wallet: any) => wallet.id)
    );
    cardData[1].amount = `+${transactions.length.toString()}`;

    TokenBalancesUsdcForChart = await getCircleWalletsBalancesDEV(
      session?.user.circleUserId as string
    );
    console.log("TokenBalancesUsdcForChart:", TokenBalancesUsdcForChart);
  }

  return (
    <div className="flex flex-col gap-5 w-full px-4">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4  transition-all sm:grid-cols-2 xl:grid-cols-3">
        {cardData.map((data, index) => (
          <Card
            key={index}
            amount={data.amount}
            discription={data.discription}
            icon={data.icon}
            label={data.label}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>
          <BarChart wallets={TokenBalancesUsdcForChart} />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Last 5 Transactions</p>
            <p className="text-sm text-gray-400">
              {`You made ${transactions?.length} transactions in the last month`}
            </p>
          </section>
          <div className="grid grid-cols-6 gap-2 px-2 place-items-center">
            <p className="text-sm">Operation</p>
            <p className="text-sm">Network</p>
            <p className="text-sm">Amounts</p>
            <p className="text-sm">Wallet ID</p>
            <p className="text-sm">TxHash</p>
            <p className="text-sm">Date</p>
          </div>
          {transactions.slice(0, 5).map((tx: any, index: any) => (
            <LastTransactions
              key={index}
              blockchain={tx.blockchain}
              transactionType={tx.transactionType}
              amounts={tx.amounts}
              walletId={tx.walletId}
              txHash={tx.txHash}
              operation={tx.operation}
              firstConfirmDate={tx.firstConfirmDate}
              tokenId={tx.tokenId}
            />
          ))}
        </CardContent>
      </section>
    </div>
  );
}
