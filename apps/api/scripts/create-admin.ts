import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from apps/api/.env if not already loaded
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function createAdminUser() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();

  console.log('--- Rangoli Fashions Admin Bootstrap ---');

  // 1. Validate environment variables
  if (!username) {
    console.error('ERROR: ADMIN_BOOTSTRAP_USERNAME is not set in apps/api/.env');
    process.exit(1);
  }

  if (!password) {
    console.error('ERROR: ADMIN_BOOTSTRAP_PASSWORD is not set in apps/api/.env');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('ERROR: ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters long');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    // 2. Connect to database and check for existing user with this username
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (existingUser) {
      console.log(`[INFO] Admin user '${existingUser.username}' already exists (ID: ${existingUser.id}).`);
      console.log('No duplicate user created. Existing credentials remain intact.');
      console.log('----------------------------------------');
      await prisma.$disconnect();
      process.exit(0);
    }

    // 3. Hash password using Argon2 (Argon2id variant)
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // 4. Create admin user in Neon PostgreSQL
    const created = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: UserRole.ADMIN,
        isActive: true,
        fullName: username,
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // 5. Verify successful creation in PostgreSQL
    const verified = await prisma.user.findUnique({
      where: { id: created.id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    if (!verified || !verified.passwordHash) {
      throw new Error('Failed to verify newly created admin user in database.');
    }

    console.log('Status: SUCCESS');
    console.log(`Username: ${verified.username}`);
    console.log(`Role: ${verified.role}`);
    console.log(`Active: ${verified.isActive}`);
    console.log(`User ID: ${verified.id}`);
    console.log('Database: Neon PostgreSQL (Connected)');
    console.log('Password Security: Argon2id Hashed');
    console.log('----------------------------------------');
  } catch (err: any) {
    console.error('ERROR: Admin creation failed:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

