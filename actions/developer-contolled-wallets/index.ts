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
const generate_ciphertext = async (secret: string) => {
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
  console.log("encryptedData:", forge.util.encode64(encryptedData));
  return forge.util.encode64(encryptedData);
};

// Create Wallet Set
export const create_wallet_set = async (name: string) => {
  console.log("name:", name);
  try {
    const response = await circleDeveloperSdk.createWalletSet({
      name: name,
    });
    console.log("response:", response.data?.walletSet);
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

  console.log(response.data?.wallets);
};

// Get Wallets
const get_wallets = async () => {
  try {
    const response = await circleDeveloperSdk.listWallets({});
    console.log(response.data?.wallets);
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
// const transfer_token = async () => {
//   const response = await circleDeveloperSdk.createTransaction({
//     walletId: `${process.env.WALLET_ID_1}`,
//     tokenId: `${process.env.USDC_TOKEN_ID}`,
//     destinationAddress: `${process.env.WALLET_ADDRESS_2}`,
//     amounts: [".01" as any],
//     fee: {
//       type: "level",
//       config: {
//         feeLevel: "MEDIUM",
//       },
//     },
//   });

//   console.log("response: ", response.data);
// };

// Check transafer state
const check_transfer_state = async (id: string) => {
  const response = await circleDeveloperSdk.getTransaction({
    id: id,
  });

  console.log("response: ", response.data);
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
