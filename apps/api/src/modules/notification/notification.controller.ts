import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';

import { Auth } from '@/src/shared/decorators/auth.decorator';
import { RequestUserEntity } from '@/src/shared/types/request-user.entity';
import { RequestUser } from '@/src/shared/decorators/request-user.decorator';
import { NotificationService } from './notification.service';
import { NotificationListDto } from './dtos/notification-list.dto';

@Controller('notification')
@Auth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('all')
  public async getNotifications(
    @Query() query: NotificationListDto,
    @RequestUser() user: RequestUserEntity,
  ) {
    return this.notificationService.list(user.id, query.page, query.limit);
  }

  @Put(':id')
  public async markRead(
    @RequestUser() user: RequestUserEntity,
    @Param('id') id: string,
  ) {
    return this.notificationService.markRead(user.id, id);
  }
}
