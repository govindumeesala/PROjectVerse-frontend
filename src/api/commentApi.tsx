import { api } from "@/lib/axios";
import { ENDPOINTS } from "./endpoints";

// --- Comments --- //
export const getComments = async (projectId: string) => {
  const res = await api.get(ENDPOINTS.PROJECT.COMMENTS(projectId));
  return res.data.data;
};

export const addCommentApi = async ({
  projectId,
  content,
}: {
  projectId: string;
  content: string;
}) => {
  const res = await api.post(ENDPOINTS.PROJECT.COMMENTS(projectId), { content });
  return res.data;
};
