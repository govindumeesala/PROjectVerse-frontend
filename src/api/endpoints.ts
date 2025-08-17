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
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    // Add more project endpoints here
  },
  // Add other resource endpoints as needed
};