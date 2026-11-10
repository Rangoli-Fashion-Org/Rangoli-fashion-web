import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'error' | 'warn'> implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private keepAliveTimer: NodeJS.Timeout | null = null;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Handle Prisma internal error events
    // Filter out harmless transient socket drops from Neon serverless compute sleep / idle scale-to-zero
    this.$on('error', (e) => {
      const msg = e.message || '';
      const isHarmless =
        msg.includes('Closed') ||
        msg.includes('kind: Closed') ||
        msg.includes('ConnectionReset') ||
        msg.includes('10054') ||
        msg.includes('forcibly closed by the remote host') ||
        msg.includes("Can't reach database server") ||
        msg.includes('cause: None') ||
        msg.includes('57P01') ||
        msg.includes('E57P01') ||
        msg.includes('terminating connection due to administrator command') ||
        msg.includes('Connection reset by peer') ||
        msg.includes('connection closed') ||
        msg.includes('broken pipe') ||
        msg.includes('ProcessInterrupts');

      if (isHarmless) {
        // Neon compute went idle or reconnected - silently absorb to prevent alarm
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

      // Keep Neon compute warm and prevent idle suspension while the backend is running
      // Pings lightweight SELECT 1 every 2.5 minutes (Neon suspends at 5 minutes)
      this.keepAliveTimer = setInterval(async () => {
        try {
          await this.$queryRawUnsafe('SELECT 1');
        } catch {
          // Silent catch - will auto-reconnect on next query
        }
      }, 150000);
    } catch (err: any) {
      this.logger.error(`Database connection error: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    await this.$disconnect();
  }
}

