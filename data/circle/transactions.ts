import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
import axios from "axios";

export const getCircleTransactionsList = async (
  userId: string,
  isLastMonth: boolean
) => {
  // Queries items created before the specified date-time (inclusive) in ISO 8601 format.

  //sample url : https://api.circle.com/v1/w3s/transactions?from=2023-01-01T12%3A04%3A05Z&to=2023-01-01T12%3A04%3A05Z&pageSize=10

  let url = "https://api.circle.com/v1/w3s/transactions?blockchain=MATIC-AMOY";

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
