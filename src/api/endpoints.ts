
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
    USER_BY_USERNAME: (username: string | undefined) => `${BASE_API}/user/${username}`, // Endpoint to get user details by username
    ALL_USERS: `${BASE_API}/user/all`, // Endpoint to fetch all users
    STATS: (username: string | undefined) => `${BASE_API}/user/stats/${username}`, // Endpoint to fetch user statistics
    BOOKMARKS: (username: string | undefined) => `${BASE_API}/user/bookmarks/${username}`, // Endpoint to fetch user bookmarks
    BOOKMARK_TOGGLE: `${BASE_API}/user/bookmarks/:projectId`, // Endpoint to toggle bookmark on a project
  },
  PROJECT: {
    CREATE: `${BASE_API}/project/create`,
    LIST: `${BASE_API}/project/list`,
    USER_PROJECTS: (username: string) => `${BASE_API}/project/user-projects/${username}`,
    CONTRIBUTED: (username: string) => `${BASE_API}/project/contributed/${username}`,
    CHECK_TITLE: `${BASE_API}/project/check-title`,

    // Add more project endpoints here
    PROJECT_FEED: `${BASE_API}/project/feed`,
    LIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/like`,
    UNLIKE_PROJECT: (id: string) => `${BASE_API}/project/${id}/unlike`,
    COMMENTS: (id: string) => `${BASE_API}/project/${id}/comments`,

    //Single Project related endpoints
    GET: (username: string, projectTitle: string) => `${BASE_API}/project/${username}/${projectTitle}`,
    UPDATE: (username: string, projectTitle: string) => `${BASE_API}/project/${username}/${projectTitle}`,
    REQUEST_TO_JOIN: (username: string, projectSlug: string) => `${BASE_API}/project/${username}/${projectSlug}/join`,
    RESPOND_TO_REQUEST: (username: string, projectSlug: string, requestId: string) => `${BASE_API}/project/${username}/${projectSlug}/respond-to-request/${requestId}`
  },
  NOTIFICATIONS: {
    LIST: `${BASE_API}/notifications`,
    UNREAD_COUNT: `${BASE_API}/notifications/unread-count`,
    MARK_READ: (id: string) => `${BASE_API}/notifications/${id}/read`,
    MARK_ALL_READ: `${BASE_API}/notifications/read-all`,
  },
  // Add other resource endpoints as needed
};