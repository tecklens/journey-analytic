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
    storeId: string,
    userId: string,
  ): Promise<MemberEntity | null> {
    const member = await this.findOneBy({
      storeId: storeId,
      userId: userId,
    });

    if (!member) return null;

    return member;
  }

  async findMemberInStore(
    storeId: string,
    userId: string,
  ): Promise<[MemberEntity[], number]> {
    return await this.findAndCount({
      where: {
        storeId: storeId,
        userId: userId,
      },
      relations: ['user'],
    });
  }

  async findAllMemberInStore(
    storeId: string,
  ): Promise<[MemberEntity[], number]> {
    return await this.findAndCount({
      where: {
        storeId: storeId,
      },
      relations: ['user'],
    });
  }

  async findAllMemberInStore2(storeId: string) {
    return await this.find({
      where: {
        storeId: storeId,
      },
      relations: ['user'],
    });
  }

  async addMember(
    storeId: string,
    member: IAddMemberData,
    isDefault: boolean,
  ): Promise<MemberEntity> {
    return await this.save({
      userId: member.userId,
      roles: member.roles,
      status: member.memberStatus,
      storeId: storeId,
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

  async isMemberOfStore(storeId: string, userId: string): Promise<boolean> {
    return this.existsBy({
      storeId: storeId,
      userId: userId,
    });
  }
}
