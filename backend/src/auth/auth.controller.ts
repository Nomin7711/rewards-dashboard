import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    return this.auth.login(user.residentId);
  }
}
