import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UsersModule, InstitutionsModule, ChatModule, AiModule, AuthModule, PrismaModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
