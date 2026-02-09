import { api } from "./axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/api/v1/auth/signin", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/api/v1/auth/signup", payload),
};
