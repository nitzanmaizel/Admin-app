export type UserRole = 'user' | 'admin';

export interface IUser {
  firstName: string;
  lastName: string;
  userId?: string;
  email: string;
  role: UserRole;
  picture?: string;
}

export interface UserData {
  id: number;
  _id: number;
  lastName: string;
  firstName: string;
  personalNumber: string;
  company: string;
  section: string;
  role: string;
  status: string;
  phone: string;
  notes: string;
  [key: string]: string | number;
}

export interface RIUsersType {
  users: UserData[];
  limit: number;
  page: number;
  total: number;
}

export type UserContextType = {
  userInfo: IUser | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
};
