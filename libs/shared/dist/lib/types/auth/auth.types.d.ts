import { UserPlan } from "../../entities/index.js";
export interface IJwtPayload {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicture?: string;
    projectId: string;
    environmentId: string;
    roles: string[];
    exp: number;
    plan: UserPlan;
}
export declare enum ApiAuthSchemeEnum {
    BEARER = "Bearer",
    API_KEY = "ApiKey"
}
export declare enum PassportStrategyEnum {
    JWT = "jwt",
    HEADER_API_KEY = "apikey",
    GITHUB = "github",
    GOOGLE = "google",
    LOCAL = "local"
}
//# sourceMappingURL=auth.types.d.ts.map