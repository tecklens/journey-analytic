import {IFailedLogin, IUser, IUserResetTokenCount} from "../../entities/index.js";

export class UserInfoDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  profilePicture?: string;
  jobTitle?: string;
  bio?: string;
  urls?: string[];
  plan: number;
  createdAt: Date;
  updatedAt: Date;

  resetTokenCount?: IUserResetTokenCount;
  failedLogin?: IFailedLogin;

  numDayDeleteVideo?: number;

  roles?: string[];

  static fromEntity(user?: IUser, roles?: string[]): UserInfoDto | null {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profilePicture: user.profilePicture,
      jobTitle: user.jobTitle,
      bio: user.bio,
      urls: user.urls,
      plan: user.plan,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      failedLogin: user.failedLogin,

      roles: roles,
    };
  }
}
