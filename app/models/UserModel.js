//import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function updateUser(session, apiKey) {
  try {
    if (!session) {
      return { success: false, message: "Session not found or unauthorized" };
    }
    await db.session.update({
      where: { id: session.id },
      data: { googleMapApiKey: apiKey },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Unknown error" };
  }
}
export async function getUserApiKey(session) {
  if (!session) return null;

  const userSession = await db.session.findUnique({
    where: { id: session.id },
    select: { googleMapApiKey: true },
  });

  return userSession?.googleMapApiKey || null;
}
