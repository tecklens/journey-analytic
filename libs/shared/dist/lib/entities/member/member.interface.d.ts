import { MemberStatus } from "../../consts/index.js";
export interface IMember {
    id: string;
    userId: string;
    projectId: string;
    roles: string[];
    status: MemberStatus;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=member.interface.d.ts.map