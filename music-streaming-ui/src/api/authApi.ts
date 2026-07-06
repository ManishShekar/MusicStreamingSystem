import axiosClient from "./axiosClient";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/Auth/login", data);
  return response.data;
};

export const registerApi = async (
  data: RegisterRequest
): Promise<{ message: string }> => {
  const response = await axiosClient.post("/Auth/register", data);
  return response.data;
};
