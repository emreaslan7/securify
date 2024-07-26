"use client";
import React from "react";
import { Bar, ResponsiveContainer } from "recharts";
import { BarChart as BarGraph, XAxis, YAxis, Tooltip, Legend } from "recharts";

type Wallet = {
  walletId: string;
  name: string;
  accountType: string;
  blockchain: string;
  balance: string;
};

// write type for customtooltip

type CustomTooltipProps = {
  active?: boolean;
  payload?: any;
  label?: any;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const walletName = label;
    const balance = payload[0].value;
    const blockchain = payload[0].payload.blockchain;
    const accountType = payload[0].payload.accountType;
    const walletId = payload[0].payload.walletId;

    return (
      <div className="p-4 border-2 border-orange-600 rounded-lg bg-black text-white">
        <p className="text-center">{walletName}</p>
        <div className="text-xs flex items-center justify-between">
          <p>Balance: </p> <p>${balance}</p>
        </div>
        <div className="text-xs flex items-center justify-between">
          <p>Blockchain: </p> <p>{blockchain}</p>
        </div>
        <div className="text-xs flex items-center justify-between">
          <p>Account Type: </p> <p>{accountType}</p>
        </div>
        <p className="text-xs">{`Wallet ID: ${walletId}`}</p>
      </div>
    );
  }

  return null;
};

export default function BarChart({ wallets }: { wallets: Wallet[] }) {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={wallets} className="fill-orange-600">
        <XAxis
          dataKey={"name"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={true}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey={"balance"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}
