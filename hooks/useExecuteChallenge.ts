import dotenv from "dotenv";
dotenv.config();

import { useState, useCallback } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

const useExecuteChallenge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const executeChallenge = useCallback(
    (userToken: string, encryptionKey: string, challengeId: string) => {
      return new Promise((resolve, reject) => {
        setLoading(true);
        setError(null);

        const sdk = new W3SSdk();

        sdk.setAppSettings({
          appId: "06864d50-fe65-5d9e-a0c4-d15415a244c0",
        });

        sdk.setAuthentication({
          userToken: userToken,
          encryptionKey: encryptionKey,
        });

        sdk.execute(challengeId, (error: any, result: any) => {
          setLoading(false);

          if (error) {
            setError(error);
            reject(error); // Hata durumunda reject ile Promise'i reddet
            return;
          }

          if (result.data) {
            console.log(`signature: ${result.data.signature}`);
          }

          setResult(result);
          resolve(result);
        });
      });
    },
    []
  );

  return { executeChallenge, loading, error, result };
};

export default useExecuteChallenge;
