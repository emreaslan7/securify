"use server";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const create_new_user = async () => {
  console.log(" Circle API Key: ", process.env.CIRCLE_API_KEY);

  const userId = uuidv4();

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/users",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
    data: { userId: userId },
  };

  return axios
    .request(options)
    .then(function (response) {
      return {
        userId: userId,
        status: response.request.status,
      };
    })
    .catch(function (error) {
      console.error(error);
    });
};
