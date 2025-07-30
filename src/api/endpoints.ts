const BASE_API = import.meta.env.VITE_BASE_API;

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${BASE_API}/auth/signup`,
    LOGIN: `${BASE_API}/auth/login`,
    GOOGLE: `${BASE_API}/auth/google`,
    LOGOUT: `${BASE_API}/auth/logout`, // If you have a logout endpoint
  },
  USER: {
    DETAILS: `${BASE_API}/user/details`,
    UPDATE: `${BASE_API}/user/update`,
    // Add more user endpoints here
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    // Add more project endpoints here
  },
  // Add other resource endpoints as needed
};