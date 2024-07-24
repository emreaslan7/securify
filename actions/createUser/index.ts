import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
import { create_new_user } from "@/actions/createUser/steps/create_new_user";
import { initialize_user } from "@/actions/createUser/steps/initialize_user";

export const create_user_account = async () => {
  const creatingUserId = await create_new_user();
  if (!creatingUserId) return;
  const userId = creatingUserId.userId as string;

  console.log("index içerisindeki userId: ", userId);

  const acquireSession = await acquire_session_token(userId);
  if (!acquireSession) return;

  console.log("index içerisindeki userToken: ", acquireSession.userToken);
  console.log(
    "index içerisindeki encryptionKey: ",
    acquireSession.encryptionKey
  );

  const userToken = acquireSession.userToken as string;
  const encryptionKey = acquireSession.encryptionKey as string;

  const challengeId = await initialize_user(userToken);

  console.log("index içerisindeki challengeId: ", challengeId);

  if (!challengeId) return;

  return { userToken, encryptionKey, challengeId, userId };
};
