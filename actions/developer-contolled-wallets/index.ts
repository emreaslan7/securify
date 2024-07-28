"use server";
import crypto from "crypto";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import forge from "node-forge";
require("dotenv").config();

// Setup developer sdk
const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: `${process.env.CIRCLE_API_KEY}`,
  entitySecret: `${process.env.CIRCLE_ENTITY_SECRET}`, // Make sure to enter the entity secret from the step above.
});

// Generate a random secret
const generate_secret = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  return secret;
};

// Fetch public key
const fetch_public_key = async (secret: string) => {
  const local_circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
    apiKey: `${process.env.CIRCLE_API_KEY}`,
    entitySecret: secret, // Make sure to enter the entity secret from the step above.
  });

  const response = await local_circleDeveloperSdk.getPublicKey();
  return response?.data?.publicKey;
};

// Generate ciphertext
export const generate_ciphertext = async (secret: string) => {
  const entitySecret = forge.util.hexToBytes(secret);
  const publicKey = forge.pki.publicKeyFromPem(
    (await fetch_public_key(secret as string)) || ""
  );
  const encryptedData = publicKey.encrypt(entitySecret, "RSA-OAEP", {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  });
  console.log("encryptedData: ", forge.util.encode64(encryptedData));
  return forge.util.encode64(encryptedData);
};

// Create Wallet Set
export const create_wallet_set = async (name: string) => {
  try {
    const response = await circleDeveloperSdk.createWalletSet({
      name: name,
    });
    return response.data?.walletSet;
  } catch (error) {
    console.log("error:", error);
  }
};

// Create Wallet Set
export const create_wallet = async (walletSetId: string, name: string) => {
  const response = await circleDeveloperSdk.createWallets({
    accountType: "SCA",
    blockchains: ["MATIC-AMOY" as any],
    count: 1,
    walletSetId: `${walletSetId}`,
    metadata: [
      {
        name: name,
      },
    ],
  });
};

export const createWalletDEV = async (
  walletSetId: string,
  name: string,
  refId: string,
  blockchain: string,
  accountType: string
) => {
  const response = await circleDeveloperSdk.createWallets({
    accountType: accountType as any,
    blockchains: [blockchain as any],
    count: 1,
    walletSetId: `${walletSetId}`,
    metadata: [
      {
        name: name,
        refId: refId,
      },
    ],
  });
};

// Get Wallets
const get_wallets = async () => {
  try {
    const response = await circleDeveloperSdk.listWallets({});
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
  } catch (error) {
    console.log("error:", error);
  }
};

// List wallet transactions
const wallet_transactions = async () => {
  const response = await circleDeveloperSdk.listTransactions({
    walletIds: [`${process.env.WALLET_ID_1}`],
  });

  console.log("response: ", response.data);
  console.log(
    "amount: ",
    response.data?.transactions && response.data.transactions[0]?.amounts
  );
};

// Get wallet balance
const get_balance = async () => {
  const response = await circleDeveloperSdk.getWalletTokenBalance({
    id: `${process.env.WALLET_ID_1}`,
  });

  console.log("response: ", response.data);
  console.log("Matic token id: ", response.data?.tokenBalances?.[0]?.token?.id);
  console.log("USDC token id: ", response.data?.tokenBalances?.[1]?.token?.id);
};

// Transfer Token
export const transferTokenDEV = async (
  walletId: string,
  destinationAddress: string,
  amount: string
) => {
  try {
    const response = await circleDeveloperSdk.createTransaction({
      walletId: `${walletId}`,
      tokenId: `36b6931a-873a-56a8-8a27-b706b17104ee`,
      destinationAddress: `${destinationAddress}`,
      amounts: [amount],
      fee: {
        type: "level",
        config: {
          feeLevel: "HIGH",
        },
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("error:", error?.response?.data);
  }
};

// Check transafer state
export const checkTransferStateDEV = async (id: string) => {
  const response = await circleDeveloperSdk.getTransaction({
    id: id,
  });

  return response.data;
};

// // Exports
// module.exports = {
//   generate_secret,
//   generate_ciphertext,
//   create_wallet_set,
//   create_wallet,
//   get_wallets,
//   get_wallet,
//   wallet_transactions,
//   get_balance,
//   transfer_token,
//   check_transfer_state,
// };
