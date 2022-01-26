declare type SessionUser = {
  id: number;
  email: string;
  name: string;
};
declare type JWTPayload = {
  user: SessionUser;
  exp: number;
};
declare type JWTResponse = {
  token: string;
  exp: number;
};

namespace process {
  interface env {
    APP_SECRET_KEY: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    NEXTAUTH_URL: string;
    DATABASE_URL: string;
    TOKEN_COOKIE_NAME: string;
  }
}


