/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- JwtService from @nestjs/jwt is typed; ESLint cannot resolve it */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** Mock users: email -> { residentId, password }. In production use hashed passwords and a DB. */
const MOCK_USERS: Array<{
  email: string;
  password: string;
  residentId: number;
}> = [
  { email: 'alex@example.com', password: 'password123', residentId: 1 },
  { email: 'jordan@example.com', password: 'password123', residentId: 2 },
];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  validateUser(
    email: string,
    password: string,
  ): Promise<{ residentId: number } | null> {
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    return Promise.resolve(user ? { residentId: user.residentId } : null);
  }

  async login(residentId: number): Promise<{ access_token: string }> {
    const payload = { sub: residentId };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}
