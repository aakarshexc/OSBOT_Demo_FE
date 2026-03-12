import api from "@/utils/axiosInstance";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      userId: string;
      email: string;
      name: string;
      role: string;
      roleDescription: string;
      clientId: string | null;
      clientName: string | null;
    };
  };
  message?: string;
}

export interface MeUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  roleDescription: string;
  clientId: string | null;
  clientName: string | null;
}

export interface MeData {
  user: MeUser;
  permissions: string[];
}

export interface MeResponse {
  success: boolean;
  data: MeData;
}

// Login API
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Login failed");
    }

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;

      throw new Error(apiMessage || "Failed to login. Please check your credentials.");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to login. Please try again.");
  }
}

// Get user profile (me)
export async function fetchMe(token: string): Promise<MeData> {
  try {
    const res = await api.get<MeResponse>(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success) {
      throw new Error("Failed to fetch user details.");
    }

    return res.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const apiMessage =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message;

      throw new Error(apiMessage || "Failed to fetch user details.");
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to fetch user details.");
  }
}

