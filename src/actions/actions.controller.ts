import { Controller, Get } from '@nestjs/common';

import { ActionsService } from './actions.service';
import { ActionsDto } from './dto/actions.dto';

@Controller()
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  // Первый запрос на определение пользователя ============
  @Get('actions')
  async getActions(): Promise<ActionsDto[]> {
    return await this.actionsService.getActions();
  }
}
