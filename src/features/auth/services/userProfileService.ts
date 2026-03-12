import api from "@/utils/axiosInstance";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL:", `${API_BASE_URL}/auth/me`);

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

//get user profile details
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
