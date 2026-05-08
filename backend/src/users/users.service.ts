import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        institution: true,
        _count: {
          select: {
            tasks: true,
            videos: true,
          },
        },
      },
    });
  }

  async updateXP(id: string, amount: number) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        xp: { increment: amount },
      },
    });

    // Check for level up logic
    const nextLevelXP = user.level * 1000;
    if (user.xp >= nextLevelXP) {
      return this.prisma.user.update({
        where: { id },
        data: {
          level: { increment: 1 },
        },
      });
    }

    return user;
  }
}
