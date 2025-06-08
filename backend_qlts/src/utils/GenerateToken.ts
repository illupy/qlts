import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const GenerateAccessToken = (email: string, role: string): string => {
  const payload = { email, role };
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRES! };

  return jwt.sign(payload, secret, options);
};
export const GenerateRefreshToken = (email: string, role: string): string => {
  const payload = { email, role };
  const secret = process.env.REFRESH_TOKEN_SECRET!;
  const options = { expiresIn: process.env.REFRESH_TOKEN_EXPIRES! };
  return jwt.sign(payload, secret, options);
};
export const VerifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};
export const VerifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};
// export const ResetPasswordToken = (email: string) => {
//   const payload = { email };
//   const secret = process.env.JWT_SECRET!;
//   const options = { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES };
//   return jwt.sign(payload, secret, options);
// };
