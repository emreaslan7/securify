import { acquire_session_token } from "@/actions/createUser/steps/acquire_session_token";
import { create_new_user } from "@/actions/createUser/steps/create_new_user";
import { initialize_user } from "@/actions/createUser/steps/initialize_user";

export const create_user_account = async () => {
  const creatingUserId = await create_new_user();
  if (!creatingUserId) return;
  const userId = creatingUserId.userId as string;

  const acquireSession = await acquire_session_token(userId);
  if (!acquireSession) return;

  const userToken = acquireSession.userToken as string;
  const encryptionKey = acquireSession.encryptionKey as string;

  const challengeId = await initialize_user(userToken);

  if (!challengeId) return;

  return { userToken, encryptionKey, challengeId, userId };
};
