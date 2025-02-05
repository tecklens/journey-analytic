import { UserPlan } from "./user-plan.enum.js";
import { UserId, UserRateLimitId, UserStatus, UserTokenId } from "../../types/index.js";
import { AuthProviderEnum } from "./user.enums.js";
export interface IUser {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    username?: string | null;
    profilePicture?: string | null;
    showOnBoarding?: boolean;
    showOnBoardingTour?: number;
    jobTitle?: string;
    externalId?: string;
    bio?: string | null;
    urls?: string[] | null;
    status: UserStatus;
    currentProjectId?: string;
    plan: UserPlan;
    billingGuide?: boolean;
    apiKeyGuide?: boolean;
    resetToken?: string;
    resetTokenDate?: Date;
    resetTokenCount?: IUserResetTokenCount;
    failedLogin?: IFailedLogin;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserRateLimit {
    _id?: UserRateLimitId;
    _userId: UserId;
    key: string;
    policyId?: string;
    requestCount: number;
    windowStart: Date;
    createdAt?: Date;
}
export interface IUserResetTokenCount {
    reqInMinute: number;
    reqInDay: number;
}
export interface IFailedLogin {
    times: number;
    lastFailedAttempt: string;
}
export interface IUserToken {
    id: UserTokenId;
    userId: UserId;
    token: string;
    refreshToken: string;
    provider: AuthProviderEnum;
    providerId: string;
    valid: boolean;
}
//# sourceMappingURL=user.interface.d.ts.map