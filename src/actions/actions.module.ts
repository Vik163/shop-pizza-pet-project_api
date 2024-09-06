import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actions as ActionsEntity } from './entities/actions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActionsEntity])],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
