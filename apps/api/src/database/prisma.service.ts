import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'error' | 'warn'> implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Handle Prisma internal error events
    // Filter out harmless transient socket drops from Neon serverless compute sleep
    this.$on('error', (e) => {
      const msg = e.message || '';
      if (msg.includes('Closed') || msg.includes('kind: Closed') || msg.includes('cause: None')) {
        // Neon compute went idle and reconnected cleanly - silence noise
        return;
      }
      this.logger.error(`Prisma error: ${msg}`);
    });

    this.$on('warn', (e) => {
      this.logger.warn(`Prisma warning: ${e.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (err: any) {
      this.logger.error(`Database connection error: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
