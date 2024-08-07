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
      // @ts-ignore
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
