"use server";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

// Setup developer sdk
const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: `${process.env.CIRCLE_API_KEY}`,
  entitySecret: `${process.env.CIRCLE_ENTITY_SECRET}`, // Make sure to enter the entity secret from the step above.
});

// Get Wallets
export const getCircleWalletsDEV = async (walletSetId: string) => {
  try {
    const response = await circleDeveloperSdk.listWallets({
      walletSetId,
    });
    return response.data?.wallets;
  } catch (error) {
    console.log("error:", error);
  }
};

// Get Specific Wallet
const get_wallet = async () => {
  try {
    const response = await circleDeveloperSdk.getWallet({
      id: `${process.env.WALLET_ID_1}`,
    });
    console.log(response.data);
  } catch (error) {
    console.log("error:", error);
  }
};

// Get wallet balance
export const getCircleTokenBalanceDEV = async (walletId: string) => {
  const response = await circleDeveloperSdk.getWalletTokenBalance({
    id: `${walletId}`,
    tokenAddresses: ["0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"],
  });

  return response.data?.tokenBalances?.[0]?.amount;
};

export const getCircleAllTokenBalancesDEV = async (walletSetId: string) => {
  try {
    const response = await circleDeveloperSdk.listWallets({
      walletSetId,
    });
    let totalBalance = 0;
    if (!response.data?.wallets) return;

    for (let i = 0; i < response.data?.wallets.length; i++) {
      const balance = await getCircleTokenBalanceDEV(
        response.data?.wallets[i].id
      );
      if (balance) totalBalance += Number(balance);
    }
    return totalBalance;
  } catch (error) {
    console.log("error:", error);
  }
};

export const getCircleWalletsBalancesDEV = async (walletSetId: string) => {
  try {
    const response = await circleDeveloperSdk.listWallets({
      walletSetId,
    });
    let balances = [];
    if (!response.data?.wallets) return;

    for (let i = 0; i < response.data?.wallets.length; i++) {
      const balance = await getCircleTokenBalanceDEV(
        response.data?.wallets[i].id
      );
      balances.push({
        walletId: response.data?.wallets[i].id,
        name: response.data?.wallets[i].name || "No Name",
        userId: walletSetId,
        accountType: response.data?.wallets[i].accountType,
        blockchain: response.data?.wallets[i].blockchain,
        address: response.data?.wallets[i].address,
        balance,
      });
    }
    return balances;
  } catch (error) {
    console.log("error:", error);
  }
};

export const updateWalletDEV = async (
  walletId: string,
  name: string,
  refId: string
) => {
  console.log("walletId:", walletId);
  console.log("name:", name);
  console.log("refId:", refId);
  try {
    const response = await circleDeveloperSdk.updateWallet({
      id: walletId,
      name,
      refId,
    });
    return response.data;
  } catch (error: any) {
    console.log("error:", error.response.data);
  }
};
