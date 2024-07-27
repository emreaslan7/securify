"use server";
import { acquire_session_token } from "@/actions/user-controlled-wallets/createUser/steps/acquire_session_token";
import axios from "axios";

export async function getCircleWalletsList(userId: string) {
  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "GET",
    url: "https://api.circle.com/v1/w3s/wallets?pageSize=10",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${acquireSession?.userToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.wallets;
  } catch (error) {
    console.error(error);
    return undefined; // Hata durumunda undefined döndür
  }
}

export const getCircleWallet = async (userId: string, walletId: string) => {
  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "GET",
    url: `https://api.circle.com/v1/w3s/wallets/${walletId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${acquireSession?.userToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.wallet;
  } catch (error) {
    console.error(error);
    return undefined; // Hata durumunda undefined döndür
  }
};

export const getCircleTokenBalances = async (
  userId: string,
  walletId: string
) => {
  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "GET",
    url: `https://api.circle.com/v1/w3s/wallets/${walletId}/balances?tokenAddress=0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${acquireSession?.userToken}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.data.tokenBalances[0].amount;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getCircleAllWalletBalances = async (userId: string) => {
  const userWallets = await getCircleWalletsList(userId);

  let allWalletBalances = [];

  for (let i = 0; i < userWallets.length; i++) {
    const tokenBalances = await getCircleTokenBalances(
      userId,
      userWallets[i].id
    );
    allWalletBalances.push({
      walletId: userWallets[i].id,
      name: userWallets[i].name || "No Name",
      userId: userWallets[i].userId,
      accountType: userWallets[i].accountType,
      blockchain: userWallets[i].blockchain,
      address: userWallets[i].address,
      balance: tokenBalances,
    });
  }

  //   {
  //   id: '2b566800-037a-5513-afc5-1a71b2cb6d52',
  //   state: 'LIVE',
  //   walletSetId: '8dbca91b-3529-5bd0-b776-0b9e519de07d',
  //   custodyType: 'ENDUSER',
  //   userId: 'dee87ed6-1be4-4a25-8be2-7e1af41a1703',
  //   refId: 'ref003',
  //   name: 'wallet003',
  //   address: '0x306d463d636f64ca2f3200ca0dedf899de5a070c',
  //   blockchain: 'ETH-SEPOLIA',
  //   accountType: 'SCA',
  //   updateDate: '2024-07-26T10:18:57Z',
  //   createDate: '2024-07-26T10:18:57Z',
  //   scaCore: 'circle_6900_singleowner_v1'
  // },

  //   {
  //   id: '47be13b9-a669-533f-892a-c9f1ca44f4fb',
  //   state: 'LIVE',
  //   walletSetId: '8dbca91b-3529-5bd0-b776-0b9e519de07d',
  //   custodyType: 'ENDUSER',
  //   userId: 'dee87ed6-1be4-4a25-8be2-7e1af41a1703',
  //   refId: 'wallet123',
  //   name: 'my wallet',
  //   address: '0x07d3dcfc50186ee065c4abc5d3c24e544c6e1c49',
  //   blockchain: 'MATIC-AMOY',
  //   accountType: 'EOA',
  //   updateDate: '2024-07-25T11:36:25Z',
  //   createDate: '2024-07-25T11:36:25Z'
  // },

  return allWalletBalances;
};

export const getCircleAllTokenBalances = async (userId: string) => {
  const userWallets = await getCircleWalletsList(userId);

  let allTokenBalances: number = 0;

  for (let i = 0; i < userWallets.length; i++) {
    const tokenBalances = await getCircleTokenBalances(
      userId,
      userWallets[i].id
    );
    allTokenBalances += Number(tokenBalances);
  }

  return allTokenBalances;
};

export const updateCircleWallet = async (
  userId: string,
  walletId: string,
  body: any
) => {
  const acquireSession = await acquire_session_token(userId);

  const options = {
    method: "PUT",
    url: `https://api.circle.com/v1/w3s/wallets/${walletId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
      "X-User-Token": `${acquireSession?.userToken}`,
    },
    data: {
      name: body.name,
      refId: body.refId,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
};
