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

# TASKS FOR SUDHEER
# create project 
1. removed contributors field  from project model
2. store contributors in the contributors collection only 
3. update the create project controller - TODO (p0) 
4. dont toast in form (create project form) - we are doing it in api file - TODO (p1)
5. like tech stack add dropdown for domain also - TODO (P0)
6. add _id along with the name and email in getAllusers route 

# TASKS FOR GOVI

1. Add social media links to profile header - p0
2. update navbar with profile pic and first name - p1 