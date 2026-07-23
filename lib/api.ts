import axios from "axios";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type DoctorProfile = {
  id: number;
  Role: "doctor" | "admin" | "staff";
  fullName?: string | null;
};

export type LoginResponse = {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  profile: DoctorProfile | null;
};

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
}
