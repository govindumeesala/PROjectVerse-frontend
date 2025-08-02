import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "./endpoints";

export const fetchAllUsers = async (): Promise<any[]> => {
  const response = await axios.get(ENDPOINTS.USER.ALL_USERS); // Make sure this is defined
  return response.data;
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
};
