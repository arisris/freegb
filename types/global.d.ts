type SessionUser = {
  id: number;
  email: string;
  name: string;
};
type JWTPayload = {
  user: SessionUser;
  exp: number;
};
type JWTResponse = {
  token: string;
  exp: number;
};