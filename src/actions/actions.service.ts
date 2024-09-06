import { Injectable } from '@nestjs/common';
import { ActionsDto } from './dto/actions.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Actions } from './entities/actions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Actions)
    private readonly actionsRepository: Repository<Actions>,
  ) {}

  async getActions(): Promise<ActionsDto[]> {
    return await this.actionsRepository.find();
  }
}
