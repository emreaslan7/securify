import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
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

// her bir wallet ve bakiyesini object olarak döndüren fonksiyon
// örnek object [{walletId: "123", balance: 100}]

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
      accountType: userWallets[i].accountType,
      blockchain: userWallets[i].blockchain,
      balance: tokenBalances,
    });
  }

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
