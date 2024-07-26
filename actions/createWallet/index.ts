"use server";
import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
import { create_wallet_challenge } from "@/actions/createWallet/steps/create_wallet_challenge";

export const create_wallet = async (
  userId: string,
  walletName: string,
  refId: string,
  blockchain: string,
  accountType: string
) => {
  const acquireSession = await acquire_session_token(userId);
  if (!acquireSession) return;

  const userToken = acquireSession.userToken as string;
  const encryptionKey = acquireSession.encryptionKey as string;

  const challengeId = await create_wallet_challenge(
    userToken,
    walletName,
    refId,
    blockchain,
    accountType
  );

  if (!challengeId) return;

  return { userToken, encryptionKey, challengeId, userId };
};
