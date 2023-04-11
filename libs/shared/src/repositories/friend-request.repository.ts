
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import {BaseAbstractRepository} from "@app/shared/repositories/base/base.abstract.repository";

@Injectable()
export class FriendRequestRepository extends BaseAbstractRepository<FriendRequestEntity> {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestRepository);
  }
}
