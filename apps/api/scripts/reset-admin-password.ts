import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function resetAdminPassword() {
  console.log('\n--- Rangoli Fashions Admin Password Reset ---');

  const username = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD; // Never trim password to preserve exact characters

  // 1. Validate environment variables
  if (!username) {
    console.error('❌ ERROR: ADMIN_BOOTSTRAP_USERNAME is not set in apps/api/.env');
    process.exit(1);
  }

  if (!password) {
    console.error('❌ ERROR: ADMIN_BOOTSTRAP_PASSWORD is not set in apps/api/.env');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ ERROR: ADMIN_BOOTSTRAP_PASSWORD must be at least 8 characters long');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    // 2. Find existing admin account by username
    const existingAdmin = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (!existingAdmin) {
      console.error(`❌ ERROR: No admin account found with username '${username}'.`);
      console.error('Please run "npm run admin:create" first to initialize the admin account.');
      process.exit(1);
    }

    // 3. Verify that the account has an ADMIN role (never modify customer accounts)
    const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER];
    if (!allowedRoles.includes(existingAdmin.role)) {
      console.error(`❌ ERROR: Account '${username}' has role '${existingAdmin.role}', not ADMIN.`);
      console.error('Refusing to modify customer accounts.');
      process.exit(1);
    }

    // 4. Hash configured password using Argon2id
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // 5. Update only that admin account's password hash and ensure isActive = true
    const updated = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    // 6. Verify the update in Neon PostgreSQL
    const isVerified = await argon2.verify(updated.passwordHash, password);
    if (!isVerified) {
      throw new Error('Verification failed immediately after updating password hash in database.');
    }

    console.log('Status: SUCCESS');
    console.log(`Username: ${updated.username}`);
    console.log(`Role: ${updated.role}`);
    console.log(`Active: ${updated.isActive}`);
    console.log(`User ID: ${updated.id}`);
    console.log('Database: Neon PostgreSQL (Connected)');
    console.log('Password Security: Argon2id Hashed & Verified');
    console.log('---------------------------------------------\n');
  } catch (err: any) {
    console.error('❌ ERROR: Password reset failed:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
