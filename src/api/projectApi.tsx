import axios from 'axios';
import { ENDPOINTS } from "./endpoints";
import { useState } from 'react';

export const useCreateProject = () => {
  const [isPending, setIsPending] = useState(false);

  const createProject = async (projectData: any) => {
    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        ENDPOINTS.PROJECT.CREATE,
        projectData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error('Error creating project: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsPending(false);
    }
  };

  return { createProject, isPending };
};