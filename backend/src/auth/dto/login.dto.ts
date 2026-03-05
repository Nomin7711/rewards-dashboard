/* eslint-disable @typescript-eslint/no-unsafe-call -- class-validator decorators are typed; ESLint cannot resolve them */
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
