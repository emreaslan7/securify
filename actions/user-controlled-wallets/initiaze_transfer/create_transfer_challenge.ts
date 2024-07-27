"use server";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const create_transfer_challenge = async (
  userId: string,
  userToken: string,
  amount: string,
  destinationAddress: string,
  tokenAddress: string,
  walletId: string,
  blockchain: string
) => {
  const idempotencyKey = uuidv4();

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/transactions/transfer",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${userToken}`,
    },
    data: {
      amounts: [amount],
      userId: userId,
      idempotencyKey: idempotencyKey,
      destinationAddress: destinationAddress,
      tokenAddress: tokenAddress,
      walletId: walletId,
      feeLevel: "HIGH",
      blockchain: blockchain,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.challengeId;
  } catch (error: any) {
    return null;
  }
};
