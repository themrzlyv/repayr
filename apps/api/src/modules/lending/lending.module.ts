import { forwardRef, Module } from '@nestjs/common';
import { LendingService } from './lending.service';
import { LendingController } from './lending.controller';
import { OrchestratorsModule } from '../orchestrators/orchestrators.module';

@Module({
  imports: [forwardRef(() => OrchestratorsModule)],
  controllers: [LendingController],
  providers: [LendingService],
  exports: [LendingService],
})
export class LendingModule {}
