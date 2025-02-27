export interface IAuthResponse {
  success: boolean;
}

export interface IUser {
  email: string | null;
  id: string;
}

export interface IAuth {
  email: string;
  password: string;
}

export interface ICredentials {
  email: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  password: string;
}
