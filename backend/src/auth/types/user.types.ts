export type JwtPayload = {
  sub: string;
  email: string;
};

export type UserWithRefreshToken = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  refreshToken: string;
};
