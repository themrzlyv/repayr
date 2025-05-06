import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CategoryQueriesInput {
  @IsOptional()
  @IsEnum(['all', 'used'])
  select: 'all' | 'used';
}
