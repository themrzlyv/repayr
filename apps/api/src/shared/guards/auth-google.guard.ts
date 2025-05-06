import { AuthGuard } from '@nestjs/passport';

export class GoogleAuth extends AuthGuard('google') {
  constructor() {
    super({
      prompt: 'select_account',
    });
  }
}
