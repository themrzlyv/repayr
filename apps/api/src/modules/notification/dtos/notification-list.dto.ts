import { IsOptional } from 'class-validator';

export class NotificationListDto {
  @IsOptional()
  page: string;

  @IsOptional()
  limit: string;
}
