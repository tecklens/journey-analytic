import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MemberStatus } from '@journey-analytic/shared';
import {MemberEntity} from "./member.entity";

export interface IAddMemberData {
  userId: string;
  roles: string[];
  memberStatus: MemberStatus;
}

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {
  constructor(dataSource: DataSource) {
    super(MemberEntity, dataSource.createEntityManager());
  }

  async findMemberByUserId(
    projectId: string,
    userId: string,
  ): Promise<MemberEntity | null> {
    const member = await this.findOneBy({
      projectId: projectId,
      userId: userId,
    });

    if (!member) return null;

    return member;
  }

  async findMemberInProject(
    projectId: string,
    userId: string,
  ): Promise<[MemberEntity[], number]> {
    return await this.findAndCount({
      where: {
        projectId: projectId,
        userId: userId,
      },
      relations: ['user'],
    });
  }

  async findAllMemberInProject(
    projectId: string,
  ): Promise<[MemberEntity[], number]> {
    return await this.findAndCount({
      where: {
        projectId: projectId,
      },
      relations: ['user'],
    });
  }

  async addMember(
    projectId: string,
    member: IAddMemberData,
    isDefault: boolean,
  ): Promise<MemberEntity> {
    return await this.save({
      userId: member.userId,
      roles: member.roles,
      status: member.memberStatus,
      projectId: projectId,
      isDefault,
    });
  }

  async findUserActiveMembers(userId: string): Promise<MemberEntity[]> {
    const requestQuery: FindOptionsWhere<MemberEntity> = {
      userId: userId,
      status: MemberStatus.ACTIVE,
    };

    return await this.findBy(requestQuery);
  }

  async isMemberOfStore(projectId: string, userId: string): Promise<boolean> {
    return this.existsBy({
      projectId: projectId,
      userId: userId,
    });
  }
}
