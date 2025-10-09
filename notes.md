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
8. Drag and drop working in create-project form. - done
9. looking for  collaboration - done
10. skeleton on homepage - done
11. Links for url 
12. session expired please login toast when opening website 
like not working - api failing
comments not loading - api failing 
create project form - project title validation is not working (frontend issue) - done
create project api not working  - done
**********************************

### Profile page
1. Request to Join button state and disable - done
2. contributors route - done
3. RequestToJoin responses render - done
4. likes and comment count and liked or bookmarked - done



# TASKS FOR GOVI
1. add actions in projects tab
  1. bookmark toggle - DONE
  2. my project open with edit option - p0 
  3. collaborations open view - p0 
1. Add social media links to profile header - p0 - done
2. update navbar with profile pic and first name - p1 - done
3. update the donut in stats component - p3
4. add username in user (frontend and backend) - p0 - done 
  2. update ui for completesignup with google - done 
  3. review changes for username - done 

## Projects
2. A project card with like,comment,share  on bottom projectname,description,techStack,domain,githubURL photo if present on bottom.
On clicking the photo card, 

# usassigned

1. separate hooks from api file (just as sudheer did for useProject hook) - current api file is getting too long and cluttered with the mix api and hooks