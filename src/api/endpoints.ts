const BASE_API = import.meta.env.VITE_BASE_API;

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${BASE_API}/auth/signup`,
    LOGIN: `${BASE_API}/auth/login`,
    GOOGLE: `${BASE_API}/auth/google`,
    LOGOUT: `${BASE_API}/auth/logout`,
    REFRESH: `${BASE_API}/auth/refresh`, 
    CHECK_USERNAME: `${BASE_API}/auth/check-username`
  },
  USER: {
    ME: `${BASE_API}/user`, // Endpoint to get the current user's details
    ALL_USERS: `${BASE_API}/user/all`, // Endpoint to fetch all users
    STATS: `${BASE_API}/user/stats`, // Endpoint to fetch user statistics
    BOOKMARKS: `${BASE_API}/user/bookmarks`, // Endpoint to fetch user bookmarks
    BOOKMARK_TOGGLE: `${BASE_API}/user/bookmarks/:projectId`, // Endpoint to toggle bookmark on a project
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    MY_PROJECTS: `${BASE_API}/project/my-projects`,
    CONTRIBUTED: `${BASE_API}/project/contributed`,
    CHECK_TITLE: `${BASE_API}/project/check-title`,

    // Add more project endpoints here
    PROJECT_FEED: `${BASE_API}/project/feed`,
    PROJECT_BY_ID: (id: string) => `${BASE_API}/project/${id}`,
    LIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/like`,
    UNLIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/unlike`,
    COMMENTS: (id: string) => `${BASE_API}/project/${id}/comments`,


    //Single Project related endpoints
    GET: (username: string, projectTitle: string) => `${BASE_API}/project/${username}/${projectTitle}`,
    UPDATE: (username: string, projectTitle: string) => `${BASE_API}/project/${username}/${projectTitle}`,
    REQUEST_TO_JOIN: (username: string, projectTitle: string) => `${BASE_API}/project/${username}/${projectTitle}/join`,
  },
  // Add other resource endpoints as needed
};