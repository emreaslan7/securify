"use server";
import dotenv from "dotenv";
dotenv.config();
import { acquire_session_token } from "@/actions/user-controlled-wallets/createUser/steps/acquire_session_token";
import { create_transfer_challenge } from "./create_transfer_challenge";

export const initialize_transfer = async (
  userId: string,
  amount: string,
  destinationAddress: string,
  tokenAddress: string,
  walletId: string,
  blockchain: string
) => {
  const acquireSession = await acquire_session_token(userId);
  if (!acquireSession) return;

  const userToken = acquireSession.userToken as string;
  const encryptionKey = acquireSession.encryptionKey as string;

  const challengeId = await create_transfer_challenge(
    userId,
    userToken,
    amount,
    destinationAddress,
    tokenAddress,
    walletId,
    blockchain
  );

  if (!challengeId) return;

  return { userToken, encryptionKey, challengeId, userId };
};
