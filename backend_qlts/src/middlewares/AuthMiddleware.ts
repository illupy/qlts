import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { GenerateAccessToken } from "../utils/GenerateToken";
import { AppDataSource } from "../data-source";
import { RefreshToken } from "../entity/RefreshToken";
import InvalidTokenException from "../exceptions/InvalidTokenException";
import { HttpStatus, Status } from "../constant/HttpStatus";
dotenv.config();
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["access_token"];
  const refreshToken = req.cookies["refresh_token"];

  if (!accessToken) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: Status.ERROR,
      message: "Missing access token",
    });
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name !== "TokenExpiredError") {
      // token không hợp lệ, không phải lỗi hết hạn
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: Status.ERROR,
        message: "Invalid token",
      });
    }

    // access token hết hạn => kiểm tra refresh token
    if (!refreshToken) {
      // throw new AccessTokenMissingException();
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: Status.ERROR,
        message: "Invalid token",
      });
    }
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      );

      // Kiểm tra refresh token trong DB
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      const savedRefreshToken = await refreshTokenRepo.findOne({
        where: { token: refreshToken },
      });

      if (!savedRefreshToken) throw new InvalidTokenException();

      // Tạo access token mới
      const newAccessToken = GenerateAccessToken(
        decodedRefreshToken.email,
        decodedRefreshToken.role
      );

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      req.user = decodedRefreshToken;
      next();
    } catch (error) {
      // throw new InvalidTokenException();
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: Status.ERROR,
        message: "Invalid token",
      });
    }
  }
};
