import { forwardRef, Module } from '@nestjs/common';
import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';
import { OrchestratorsModule } from '../orchestrators/orchestrators.module';
import { JwtTokenModule } from '../jwt-token/jwt-token.module';

@Module({
  imports: [JwtTokenModule, forwardRef(() => OrchestratorsModule)],
  controllers: [LendingController],
  providers: [LendingService],
  exports: [LendingService],
})
export class LendingModule {}
