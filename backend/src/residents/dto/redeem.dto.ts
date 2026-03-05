/* eslint-disable @typescript-eslint/no-unsafe-call -- class-validator decorators are typed; ESLint cannot resolve them */
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class RedeemDto {
  @IsString()
  giftCardId: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity?: number;
}
