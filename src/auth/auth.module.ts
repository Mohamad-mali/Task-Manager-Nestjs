import { Module } from '@nestjs/common';

//internal Imports
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
