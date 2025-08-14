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

1.file upload for project photo

## Featues in home page
1. Rendering of all projects in centre 
2. Sidebar on left with myprojects, projects,e.t.c
3. Notifications on the right bar