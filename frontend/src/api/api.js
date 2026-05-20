import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const googleAuth = (credential) =>
  API.post("/auth/google", { credential });

export const getProblems = () => API.get("/problems");
export const addProblem = (data) => API.post("/problems", data);

export const addComment = (problemId, data) =>
  API.post(`/problems/${problemId}/comments`, data);

export const createFolder = (data) => API.post("/folders", data);

export const getFolders = () => API.get("/folders");

export const getFolderById = (folderId) => API.get(`/folders/${folderId}`);

export const renameFolder = (folderId, data) =>
  API.put(`/folders/${folderId}`, data);

export const deleteFolder = (folderId) => API.delete(`/folders/${folderId}`);

export const getBookmarksInFolder = (folderId) =>
  API.get(`/folders/${folderId}/bookmarks`);

export const addBookmarkToFolder = (folderId, data) =>
  API.post(`/folders/${folderId}/bookmark`, data);

export const removeBookmarkFromFolder = (folderId, bookmarkId) =>
  API.delete(`/folders/${folderId}/bookmark/${bookmarkId}`);
export const updateBookmarkInFolder = (folderId, bookmarkId, data) =>
  API.put(`/folders/${folderId}/bookmark/${bookmarkId}`, data);
// Add this to your api/api.js file

// 1. Get all resources in a specific folder

export const getResourcesInFolder = (folderId) =>
  API.get(`/resources/${folderId}/resources`);

// Share endpoints
export const createFolderShare = (folderId) =>
  API.post(`/folders/${folderId}/share`);
export const revokeFolderShare = (folderId) =>
  API.post(`/folders/${folderId}/unshare`);

// Public API (no auth) for fetching shared folder by token
export const getPublicFolder = (token) => {
  return axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/folders/public/${token}`,
  );
};

export const addResourceToFolder = (folderId, data) =>
  API.post(`/resources/${folderId}/resource`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeResourceFromFolder = (folderId, resourceId) =>
  API.delete(`/resources/${folderId}/resource/${resourceId}`);

export const updateResourceInFolder = (folderId, resourceId, data) =>
  API.put(`/resources/${folderId}/resource/${resourceId}`, data);

export const getMyProfile = () => API.get("/users/profile");

export const updateMyProfile = (data) => API.put("/users/profile", data);

export const getProfileByUsername = (username) => API.get(`/users/${username}`);
export const getUserById = (userId) => API.get(`/users/id/${userId}`);

export const getChatHistory = () => API.get("/chat-history");
export const getChatMessages = (user1, user2) =>
  API.get(`/messages/${user1}/${user2}`);

export default API;
