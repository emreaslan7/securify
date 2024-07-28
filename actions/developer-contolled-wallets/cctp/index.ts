"use server";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
import { generate_ciphertext } from "@/actions/developer-contolled-wallets/index";
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import {
  AMOY_RPC_URL,
  CIRCLE_MESSAGE_TRANSMITTER_ADDRESS_AMOY,
  CIRCLE_MESSAGE_TRANSMITTER_ADDRESS_SEPOLIA,
  CIRCLE_TOKEN_MESSENGER_ADDRESS,
  CIRCLE_USDC_CONTRACT_ADDRESS_AMOY,
  CIRCLE_USDC_CONTRACT_ADDRESS_SEPOLIA,
  SEPOLIA_RPC_URL,
} from "./constant";

const Web3 = require("web3").default;

const get_cipher_text = async () => {
  let ciphertext = await generate_ciphertext(
    `${process.env.CIRCLE_ENTITY_SECRET}`
  );
  return ciphertext;
};

export const approve_usdc = async (
  senderWalletId: string,
  fromBlockchain: string
) => {
  let usdcContractAddress: string;
  if (fromBlockchain === "ETH-SEPOLIA")
    usdcContractAddress = CIRCLE_USDC_CONTRACT_ADDRESS_SEPOLIA;
  else usdcContractAddress = CIRCLE_USDC_CONTRACT_ADDRESS_AMOY;

  const idempotencyKey = uuidv4();
  const ciphertext = await get_cipher_text();

  const url =
    "https://api.circle.com/v1/w3s/developer/transactions/contractExecution";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
    body: JSON.stringify({
      abiFunctionSignature: "approve(address,uint256)",
      abiParameters: [`${CIRCLE_TOKEN_MESSENGER_ADDRESS}`, "10000000000"],
      idempotencyKey,
      contractAddress: `${usdcContractAddress}`,
      feeLevel: "HIGH",
      walletId: `${senderWalletId}`,
      entitySecretCiphertext: ciphertext,
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
      return json.data.id;
    })
    .catch((err) => console.error("error:" + err));
};

export const burn_usdc = async (
  senderWalletId: string,
  receiverAddress: string,
  amount: string,
  receiverBlockchain: string
) => {
  const ciphertext = await get_cipher_text();
  // amount değerini 6 decimal ile çarpabilir misin?

  amount = (parseFloat(amount) * 1000000).toString();
  const blockchainDomain = receiverBlockchain === "ETH-SEPOLIA" ? "0" : "7";
  const usdcContractAddress =
    receiverBlockchain === "ETH-SEPOLIA"
      ? CIRCLE_USDC_CONTRACT_ADDRESS_AMOY
      : CIRCLE_USDC_CONTRACT_ADDRESS_SEPOLIA;

  const rpcUrl =
    receiverBlockchain === "ETH-SEPOLIA" ? SEPOLIA_RPC_URL : AMOY_RPC_URL;
  const web3 = new Web3(`${rpcUrl}`);

  const encodedDestinationAddress = web3.eth.abi.encodeParameter(
    "address",
    `${receiverAddress}`
  );

  console.log("encoded address", encodedDestinationAddress);

  const data = {
    abiFunctionSignature: "depositForBurn(uint256,uint32,bytes32,address)",
    abiParameters: [
      `${amount}`,
      blockchainDomain,
      `${encodedDestinationAddress}`,
      `${usdcContractAddress}`,
    ],
    idempotencyKey: uuidv4(),
    contractAddress: `${CIRCLE_TOKEN_MESSENGER_ADDRESS}`,
    feeLevel: "HIGH",
    walletId: `${senderWalletId}`,
    entitySecretCiphertext: ciphertext,
  };

  try {
    const response = await fetch(
      "https://api.circle.com/v1/w3s/developer/transactions/contractExecution",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    console.log("Success:", result.data.id);
    return result.data.id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const fetch_deposit_transaction = async (burnId: string) => {
  const url = `https://api.circle.com/v1/w3s/transactions/${burnId}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return json.data.transaction;
    })
    .catch((err) => console.error("error:" + err));
};

const get_attestation = async (burnId: string, receiverBlockchain: string) => {
  const rpcUrl =
    receiverBlockchain === "ETH-SEPOLIA" ? AMOY_RPC_URL : SEPOLIA_RPC_URL;
  const web3 = new Web3(`${rpcUrl}`);

  let transaction: any = { txHash: null };
  while (!transaction.txHash) {
    transaction = await fetch_deposit_transaction(burnId);
    await new Promise((r) => setTimeout(r, 3000));
    console.log("transaction: 3sn de 1 kontrol ediyor", transaction);
  }

  // 2 - Decoding and Creating messageBytes and messageHash with a Web3 Library
  // Get messageBytes from EVM logs using tx_hash of thetransaction.
  const transactionReceipt = await web3.eth.getTransactionReceipt(
    transaction.txHash
  );
  const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
  const log = transactionReceipt.logs.find(
    (l: any) => l.topics[0] === eventTopic
  );
  const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
  const messageHash = web3.utils.keccak256(messageBytes);

  console.log("messageBytes oooooo", messageBytes);
  console.log("messageHash oooooo", messageHash);
  // 3 - Fetch Attestation Signature from Circle's Iris API
  // Get attestation signature from iris-api.circle.com
  let attestationResponse: any = { status: "pending" };
  while (attestationResponse.status != "complete") {
    const response = await fetch(
      `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
    );
    attestationResponse = await response.json();
    await new Promise((r) => setTimeout(r, 2000));
    console.log("attesionResponse: 2sn de 1 ", attestationResponse);
  }
  return {
    messageBytes: messageBytes,
    attestation: attestationResponse.attestation,
  };
};

export const mint_usdc = async (
  receiverWalletId: string,
  burnId: string,
  receiverBlockchain: string
) => {
  const ciphertext = await get_cipher_text();

  const attestation_variables = await get_attestation(
    burnId,
    receiverBlockchain
  );

  const transmitterContractAddress =
    receiverBlockchain === "ETH-SEPOLIA"
      ? CIRCLE_MESSAGE_TRANSMITTER_ADDRESS_SEPOLIA
      : CIRCLE_MESSAGE_TRANSMITTER_ADDRESS_AMOY;

  const url =
    "https://api.circle.com/v1/w3s/developer/transactions/contractExecution";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
    body: JSON.stringify({
      abiFunctionSignature: "receiveMessage(bytes,bytes)",
      abiParameters: [
        `${attestation_variables.messageBytes}`,
        `${attestation_variables.attestation}`,
      ],
      idempotencyKey: `${uuidv4()}`,
      contractAddress: `${transmitterContractAddress}`,
      feeLevel: "HIGH",
      walletId: `${receiverWalletId}`,
      entitySecretCiphertext: ciphertext,
    }),
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json.data);
      return json.data;
    })
    .catch((err) => console.error("error:" + err));
};
