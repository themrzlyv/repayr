import { IsNotEmpty, IsString } from 'class-validator';

export class SearchAccountQuery {
  @IsString()
  @IsNotEmpty()
  tagName: string;
}
