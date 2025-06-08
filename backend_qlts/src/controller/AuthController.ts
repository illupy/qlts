// controllers/auth-controller.ts
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { LoginDto } from "../types/LoginDto";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
} from "../utils/GenerateToken";
import { HttpStatus, Status } from "../constant/HttpStatus";
import { SuccessMessage } from "../constant/AppMessage";
import { UserInfoDto } from "../types/UserInfoDto";
import { comparePassword, hashPassword } from "../utils/HashPassword";
import NotFoundException from "../exceptions/NotFoundException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import { RegisterDto } from "../types/RegisterDto";
import ExistedException from "../exceptions/ExistedException";
import { UserRole } from "../constant/AppConstant";
import ConfirmPasswordNotMatchException from "../exceptions/ConfirmPasswordNotMatch";
import HttpException from "../exceptions/HttpException";
import { validationResult } from "express-validator";
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    const loginData: LoginDto = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const tokenRepo = AppDataSource.getRepository(RefreshToken);
    // Authenticate user

    const user = await userRepo.findOne({ where: { email: loginData.email } });

    if (!user) {
      throw new NotFoundException("user");
    }
    if (!(await comparePassword(loginData.password, user.password))) {
      throw new WrongCredentialsException();
    }
    // generate access token and refresh token
    const accessToken = GenerateAccessToken(user.email, user.role);
    const refreshToken = GenerateRefreshToken(user.email, user.role);
    // Save refresh token to database
    const savingRefreshToken = tokenRepo.create({ token: refreshToken, user });
    await tokenRepo.save(savingRefreshToken);
    //Extract user information
    const userInfo: UserInfoDto = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role,
    };
    return res.cookie('access_token', accessToken, {
    httpOnly: true,         
    // secure: true,           
    sameSite: 'strict',     
    maxAge: 60 * 60 * 1000, 
  })
  .cookie('refresh_token', refreshToken, {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }).status(HttpStatus.OK).json({
      status: Status.SUCCESS, 
      message: SuccessMessage.USER_LOGGED_IN,
      data: { user: userInfo },
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
      });
    }
  }
};
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    const userRepo = AppDataSource.getRepository(User);
    const registerData: RegisterDto = req.body;
    // Check if user already exists
    const existingUser = await userRepo.findOne({
      where: { email: registerData.email },
    });
    if (existingUser) {
      throw new ExistedException(registerData.email);
    }
    // Check confirm password
    if (registerData.password !== registerData.confirmPassword) {
      throw new ConfirmPasswordNotMatchException();
    }
    // Hash password
    const hashedPassword = await hashPassword(registerData.password);
    // Create new user
    const newUser = userRepo.create({
      email: registerData.email,
      password: hashedPassword,
      fullName: registerData.name,
      role: registerData.role as UserRole,
    });
    await userRepo.save(newUser);
    return res.status(HttpStatus.CREATED).json({
      status: Status.SUCCESS,
      message: SuccessMessage.USER_REGISTERED,
    });
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
      });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refresh_token'];

    if (refreshToken) {
      // delete refresh token from database
      const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
      await refreshTokenRepo.delete({ token: refreshToken });
    }

    // delete cookies from client
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
      // secure: true, 
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'strict',
    });

    res.status(HttpStatus.OK).json({ message: SuccessMessage.USER_LOGGED_OUT });
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: Status.ERROR,
      });
    }
  }
};
export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ status: "error", message: "Unauthorized" });
  }
  const { email, role } = req.user; // req.user được middleware gán từ access token
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { email } });
  return res.status(HttpStatus.OK).json({
    status: "success",
    user: { name:user.fullName, email, role }
  });
};