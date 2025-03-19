import apiClient from "./apiUtils";

export const registerUser = async (userData) => {
    return await apiClient.post("/auth/register", userData);
};

export const loginUser = async (userData) => {
    return await apiClient.post("/auth/login", userData);
};