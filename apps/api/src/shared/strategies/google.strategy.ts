import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:8000/auth/google/callback',
      scope: ['email', 'profile'],
      proxy: true,
    });
  }

  public validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, id, photos } = profile;
    const user = {
      provider: 'google',
      provider_id: id,
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      avatar: photos[0].value,
    };
    return done(null, user);
  }
}
