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
