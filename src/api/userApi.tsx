import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "./endpoints";
import { api } from "@/lib/axios";

export const fetchAllUsers = async (): Promise<any> => {
  const response = await api.get(ENDPOINTS.USER.ALL_USERS);
  return response.data;
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
};
