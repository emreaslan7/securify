import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

// Setup developer sdk
const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: `${process.env.CIRCLE_API_KEY}`,
  entitySecret: `${process.env.CIRCLE_ENTITY_SECRET}`, // Make sure to enter the entity secret from the step above.
});

// List wallet transactions
export const getCircleWalletTransactionsDEV = async (walletIds: any) => {
  const response = await circleDeveloperSdk.listTransactions({
    walletIds: walletIds,
  });

  return response.data?.transactions;
};
