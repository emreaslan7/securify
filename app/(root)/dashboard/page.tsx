import BarChart from "@/components/bar-chart";
import PageTitle from "@/components/page-title";
import Card, { CardContent, CardProps } from "@/components/card";
import {
  Activity,
  CreditCard,
  DollarSign,
  ArrowLeftRightIcon,
} from "lucide-react";
import SalesCard, { SalesProps } from "@/components/sales-card";
import {
  getCircleAllTokenBalances,
  getCircleTokenBalances,
  getCircleWallet,
  getCircleWalletsList,
  updateCircleWallet,
} from "@/data/circle/wallet";
import { getCircleTransactionsList } from "@/data/circle/transactions";

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
  // {
  //   label: "Sales",
  //   amount: "+12,234",
  //   discription: "+19% from last month",
  //   icon: CreditCard,
  // },
  // {
  //   label: "Active Mow",
  //   amount: "+573",
  //   discription: "+201 from last month",
  //   icon: Activity,
  // },
];

const userSalesData: SalesProps[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    salesAmount: "+$1,999.00",
  },
  {
    name: "Jackson Lee",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$1,999.00",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    salesAmount: "+$39.00",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    salesAmount: "+$299.00",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    salesAmount: "+$39.00",
  },
];

export default async function DashboardPage() {
  // getCircleWalletsList("de00db2b-b9e2-4049-934c-e0a90eee3020");
  // getCircleWallet(
  //   "de00db2b-b9e2-4049-934c-e0a90eee3020",
  //   "dcd042ea-f71b-54ea-9e9e-ae44f3b52d79"
  // );
  // updateCircleWallet(
  //   "de00db2b-b9e2-4049-934c-e0a90eee3020",
  //   "dcd042ea-f71b-54ea-9e9e-ae44f3b52d79",
  //   { name: "test", refId: "test" }
  // );
  // getCircleTokenBalances(
  //   "473b0e76-19a5-43c0-8bed-7d851a4ee9da",
  //   "b9870113-a70c-58ba-b39d-37797ca66cad"
  // );
  const totalBalance = await getCircleAllTokenBalances(
    "473b0e76-19a5-43c0-8bed-7d851a4ee9da"
  );
  cardData[0].amount = `${totalBalance.toString()} $`;

  const transactions = await getCircleTransactionsList(
    "473b0e76-19a5-43c0-8bed-7d851a4ee9da"
  );
  cardData[1].amount = `+${transactions.length.toString()}`;

  return (
    <div className="flex flex-col gap-5 w-full px-4">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4  transition-all sm:grid-cols-2 xl:grid-cols-2">
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
          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Last Transactions</p>
            <p className="text-sm text-gray-400">
              You made 265 sales this month.
            </p>
          </section>
          {userSalesData.map((data, index) => (
            <SalesCard
              key={index}
              email={data.email}
              name={data.name}
              salesAmount={data.salesAmount}
            />
          ))}
        </CardContent>
      </section>
    </div>
  );
}
