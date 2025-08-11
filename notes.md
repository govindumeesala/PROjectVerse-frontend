What React Query is great for:
"Server state" management — anything that comes from a backend API.

Fetching projects, users, tasks, etc.

Caching responses

Background updates

Pagination & infinite scroll

Syncing with server data


# Anywhere you call protected routes, use api instead of axios:

// src/api/userApi.ts
import api from "@/lib/axios";

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

# TODO
1. ADD EYE ICON FOR TOGGLE OF PASSWORD TO SHOW AND HIDE. - done

## Refining and enhancements in create-project form 

1.adding status and contributors in form
2.project_id's in user model
3.star mark for mandatory fields (red color)
4.file upload for project photo