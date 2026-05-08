import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role as Role,
        // password: hashedPassword, // Note: Add password field to Prisma schema if needed, for now using dummy
      },
    });

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });

    return { user, token };
  }

  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real app, verify password here
    // const isMatch = await bcrypt.compare(data.password, user.password);
    // if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });

    return { user, token };
  }
}
