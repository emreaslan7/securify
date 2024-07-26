"use server";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const initialize_user = async (userToken: string) => {
  const idempotencyKey = uuidv4();

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/initialize",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer  ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${userToken}`,
    },
    data: { idempotencyKey: idempotencyKey, blockchains: ["MATIC-AMOY"] },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data.data.challengeId;
    })
    .catch(function (error) {
      console.error(error);
    });
};
