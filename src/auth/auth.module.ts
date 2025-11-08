import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

//internal Imports
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [],
  providers: [AuthGuard, JwtService],
  exports: [AuthGuard],
})
export class AuthModule {}
