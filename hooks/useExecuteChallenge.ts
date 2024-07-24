import dotenv from "dotenv";
dotenv.config();

import { useState, useCallback } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

// const useExecuteChallenge = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [result, setResult] = useState(null);

//   const executeChallenge = useCallback(
//     (userToken: string, encryptionKey: string, challengeId: string) => {
//       setLoading(true);
//       setError(null);

//       const sdk = new W3SSdk();

//       sdk.setAppSettings({
//         appId: "06864d50-fe65-5d9e-a0c4-d15415a244c0",
//       });

//       sdk.setAuthentication({
//         userToken: userToken,
//         encryptionKey: encryptionKey,
//       });

//       sdk.execute(challengeId, (error: any, result: any) => {
//         setLoading(false);

//         if (error) {
//           console.log(
//             `${error?.code?.toString() || "Unknown code"}: ${
//               error?.message ?? "Error!"
//             }`
//           );
//           setError(error);
//           return;
//         }

//         console.log("result:", result);
//         console.log(`Challenge: ${result.type}`);
//         console.log(`status: ${result.status}`);

//         if (result.data) {
//           console.log(`signature: ${result.data.signature}`);
//         }

//         setResult(result);
//         return result;
//       });
//     },
//     []
//   );

//   return { executeChallenge, loading, error, result };
// };

const useExecuteChallenge = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const executeChallenge = useCallback(
    (userToken: string, encryptionKey: string, challengeId: string) => {
      return new Promise((resolve, reject) => {
        // Promise döndür
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
            console.log(
              `${error?.code?.toString() || "Unknown code"}: ${
                error?.message ?? "Error!"
              }`
            );
            setError(error);
            reject(error); // Hata durumunda reject ile Promise'i reddet
            return;
          }

          console.log("result:", result);
          console.log(`Challenge: ${result.type}`);
          console.log(`status: ${result.status}`);

          if (result.data) {
            console.log(`signature: ${result.data.signature}`);
          }

          setResult(result);
          resolve(result); // Başarılı sonuçta resolve ile Promise'i çöz
        });
      });
    },
    []
  );

  return { executeChallenge, loading, error, result };
};

export default useExecuteChallenge;
