"use server";

import dotenv from "dotenv";
dotenv.config();
import { acquire_session_token } from "@/actions/user-controlled-wallets/createUser/steps/acquire_session_token";
import axios from "axios";

export const getCircleTransactionsList = async (
  userId: string,
  isLastMonth: boolean
) => {
  let url = "https://api.circle.com/v1/w3s/transactions?pageSize=10";

  if (isLastMonth) {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    url += `&from=${firstDay.toISOString()}&to=${lastDay.toISOString()}`;
  }

  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${acquireSession?.userToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.transactions;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
