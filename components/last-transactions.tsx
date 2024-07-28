import React from "react";
import Image from "next/image";
import UsdcIcon from "@/public/blockchain/usdc.png";
import PolygonIcon from "@/public/blockchain/polygon.png";
import EthIcon from "@/public/blockchain/ethereum.png";
import { MoveDown, MoveUp } from "lucide-react";
import truncateAddress from "@/helpers/truncateAddress";
import { getTimeAgo } from "@/helpers/getTimeAgo";
export type LastTransactionsProps = {
  blockchain: string;
  transactionType: string;
  amounts: string[];
  walletId: string;
  txHash: string;
  operation: string;
  firstConfirmDate: Date;
  tokenId: string;
};

export default function LastTransactions({ ...props }: LastTransactionsProps) {
  return (
    <div className="grid grid-cols-6 p-2 border rounded-lg place-items-center">
      <div className="flex items-center text-sm">
        {props.transactionType === "INBOUND" ? (
          <div className="h-9 w-9 rounded-full bg-green-200 p-1 flex items-center justify-center">
            <MoveUp size={20} className="text-green-600" strokeWidth="3px" />
          </div>
        ) : (
          <div className="h-9 w-9 rounded-full bg-red-200 p-1 flex items-center justify-center">
            <MoveDown size={20} className="text-red-600" strokeWidth="3px" />
          </div>
        )}
        <div className="ml-3">
          <p className="font-bold">{props.operation}</p>
          <p className="text-gray-400">{props.transactionType}</p>
        </div>
      </div>
      <div className="text-xs">
        <Image
          src={props.blockchain === "MATIC-AMOY" ? PolygonIcon : EthIcon}
          alt="blockchain icon"
          width={20}
          height={20}
        />
      </div>
      <div className="text-xs flex justify-center items-center gap-2">
        {props.amounts.join(", ")}
        <Image src={UsdcIcon} alt="token icon" width={20} height={20} />
      </div>
      <div className="text-xs">{truncateAddress(props.walletId)}</div>
      <div className="text-xs">
        {props.txHash ? truncateAddress(props.txHash) : "FAILED TX"}
      </div>
      <div className="text-xs">
        {props.firstConfirmDate
          ? getTimeAgo(props.firstConfirmDate?.toLocaleString())
          : "FAILED TX"}
      </div>
    </div>
  );
}
