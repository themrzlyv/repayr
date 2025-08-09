import { IsNotEmpty, IsString } from 'class-validator';

export class SearchAccountDto {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
