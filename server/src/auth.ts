import { sign } from "jsonwebtoken";
import { AppUser } from "./AppUser";
// import dotenv from "dotenv";

export const createTokens = (user: Pick<AppUser,'email'|'id'|'count' >) => {

  const refresh_secret = process.env.REFRESH_TOKEN_SECRET ? process.env.REFRESH_TOKEN_SECRET : 'secret'; 
  const access_secret = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : 'secret'; 

  const refreshToken = sign(
    { id: user.id, count: user.count },
    refresh_secret,
    {
      expiresIn: "7d"
    }
  );
  const accessToken = sign({ id: user.id, email: user.email },access_secret , {
    expiresIn: "7d"//"50min"//"15min"
  });

  return { refreshToken, accessToken };
};