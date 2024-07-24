import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
import axios from "axios";

export const getCircleTransactionsList = async (userId: string) => {
  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "GET",
    url: `https://api.circle.com/v1/w3s/transactions?blockchain=MATIC-AMOY`,
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
