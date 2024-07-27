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

  console.log("response: ", response.data?.transactions);
  return response.data?.transactions;
  //   console.log(
  //     "amount: ",
  //     response.data?.transactions && response.data.transactions[0]?.amounts
  //   );
};
