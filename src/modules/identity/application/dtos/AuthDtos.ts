export interface AuthenticateInput {
  email: string;
  password: string;
}

export interface AuthenticateOutput {
  user: { id: number; name: string; email: string; roles: string[] };
  token: string;
  refreshToken: string;
}
