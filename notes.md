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

1.file upload for project photo - done

## Featues in home page
1.Ressponsive home page with 3sections vertically 1.sidebar 2.projects 3.notifications on large screeen and only projects on medium and small screen with seperate notifications page.
2. Sidebar on left with myprojects, projects,e.t.c
3. Notifications on the right bar

##
Sorting/Filtering bar → filter by domain (AI/Web/IoT), status, tech stack.

Notifications inline → show "3 new requests on your project" directly on card.

Collaborator avatars → mini preview of who’s inside the project (like GitHub repo collaborators).

"Looking for collaborators" badge (like a "We’re hiring" tag).

# TASKS FOR SUDHEER
# create project 
1. removed contributors field  from project model - done
2. store contributors in the contributors collection only - done
3. update the create project controller - TODO (p0) - done
4. dont toast in form (create project form) - we are doing it in api file - TODO (p1) - done
5. like tech stack add dropdown for domain also - TODO (P0) - done.
6. add _id along with the name and email in getAllusers route - done
11. update status on projectCard to ongoing,completed,lookingforCollaboration - done 
11. a (change color of looking for collaborators)
12. comment count not updating - done
8. Drag and drop working in create-project form.
9. Bookmarks, looking for  collaboration
10. skeleton on homepage
11. Links for urls
12. create-project button hover cursor:pointer


# TASKS FOR GOVI

1. Add social media links to profile header - p0
2. update navbar with profile pic and first name - p1
3. active and completed hover in piechar.

## Projects
2. A project card with like,comment,share  on bottom projectname,description,techStack,domain,githubURL photo if present on bottom.
On clicking the photo card, 
