import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { GoogleAuth } from '@/src/shared/guards/auth-google.guard';

import { CreateAccountDto } from './dtos/create-account.dto';

import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { JwtRefreshGuard } from '@/src/shared/guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(input, req, res);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Get('google')
  @UseGuards(GoogleAuth)
  public googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuth)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return await this.authService.loginWithGoogle(req.user, req, res);
  }

  @Post('register')
  public async register(@Body() input: CreateAccountDto) {
    return this.authService.register(input);
  }

  @Delete('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(req, res);
  }
}
