"use server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const create_wallet_challenge = async (
  userToken: string,
  walletName: string,
  refId: string,
  blockchain: string,
  accountType: string
) => {
  const idempotencyKey = uuidv4();

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/wallets",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${userToken}`,
    },
    data: {
      metadata: [{ name: walletName, refId: refId }],
      blockchains: [blockchain],
      accountType: accountType,
      idempotencyKey: idempotencyKey,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.challengeId;
  } catch (error) {
    return error;
  }
};
