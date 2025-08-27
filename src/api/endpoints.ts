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
    BOOKMARKS: `${BASE_API}/user/bookmarks`, // Endpoint to fetch user bookmarks
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    MY_PROJECTS: `${BASE_API}/project/my-projects`,
    CONTRIBUTED: `${BASE_API}/project/contributed`,

  },
  // Add other resource endpoints as needed
};