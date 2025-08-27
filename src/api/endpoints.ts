const BASE_API = import.meta.env.VITE_BASE_API;

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${BASE_API}/auth/signup`,
    LOGIN: `${BASE_API}/auth/login`,
    GOOGLE: `${BASE_API}/auth/google`,
    LOGOUT: `${BASE_API}/auth/logout`,
    REFRESH: `${BASE_API}/auth/refresh`, 
  },
  USER: {
    ME: `${BASE_API}/user`, // Endpoint to get the current user's details
    ALL_USERS: `${BASE_API}/user/all`, // Endpoint to fetch all users
    STATS: `${BASE_API}/user/stats`, // Endpoint to fetch user statistics
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    // Add more project endpoints here
    MY_PROJECTS: `${BASE_API}/project/my-projects`, // Endpoint to get user's projects
    PROJECT_FEED: `${BASE_API}/project/feed`,
    PROJECT_BY_ID: (id: string) => `${BASE_API}/project/${id}`,
    LIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/like`,
    UNLIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/unlike`,
    COMMENTS: (id: string) => `${BASE_API}/project/${id}/comments`,
    BOOKMARK_PROJECT: (id: string) => `${BASE_API}/bookmarks/${id}`,
    UNBOOKMARK_PROJECT: (id: string) => `${BASE_API}/bookmarks/${id}`,
    REQUEST_TO_JOIN: (id: string) => `${BASE_API}/project/${id}/request-join`,
  },
  // Add other resource endpoints as needed
};