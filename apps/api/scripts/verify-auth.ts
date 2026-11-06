import { PrismaClient, UserRole } from '@prisma/client';
import { AuthService } from '../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/database/prisma.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runVerification() {
  console.log('\n======================================================');
  console.log('--- RANGOLI FASHIONS AUTHENTICATION VERIFICATION ---');
  console.log('======================================================\n');

  const prisma = new PrismaClient();
  const prismaService = new PrismaService();
  const configService = new ConfigService();
  const jwtService = new JwtService({ secret: 'rf_super_secure_access_secret_production_key_2026' });
  const authService = new AuthService(prismaService, jwtService, configService);

  let allPassed = true;

  try {
    // -----------------------------------------------------------------
    // TEST 1 & 2 & 3: Verify Admin Record in Neon & Argon2 Hash
    // -----------------------------------------------------------------
    console.log('[TEST 1, 2 & 3] Checking Admin record in Neon PostgreSQL...');
    const adminUser = await prisma.user.findUnique({
      where: { username: 'rangoliadmin' },
    });

    if (!adminUser) {
      console.error('❌ FAILED: User rangoliadmin not found in database');
      allPassed = false;
    } else {
      console.log('✅ PASSED: Admin record found in Neon PostgreSQL:');
      console.log(`   - ID: ${adminUser.id}`);
      console.log(`   - Username: ${adminUser.username}`);
      console.log(`   - Role: ${adminUser.role}`);
      console.log(`   - Active: ${adminUser.isActive}`);
      const isArgon2 = adminUser.passwordHash.startsWith('$argon2');
      console.log(`   - Password Hash Format: ${isArgon2 ? 'Argon2id ($argon2id$...)' : 'Unknown'}`);
      if (!isArgon2) {
        console.error('❌ FAILED: Password hash is not in Argon2 format');
        allPassed = false;
      }
    }

    // -----------------------------------------------------------------
    // TEST 4: Test Admin Login with Valid Credentials
    // -----------------------------------------------------------------
    console.log('\n[TEST 4] Testing Admin Login with valid credentials...');
    try {
      const loginResult = await authService.loginAdmin({
        username: 'rangoliadmin',
        password: 'YourStrongPassword@123',
      });
      console.log('✅ PASSED: Admin login successful:');
      console.log(`   - Authenticated User: ${loginResult.user.username}`);
      console.log(`   - Role: ${loginResult.user.role}`);
      console.log(`   - Access Token Generated: ${loginResult.tokens.accessToken.substring(0, 30)}...`);
    } catch (err: any) {
      console.error('❌ FAILED: Admin login failed:', err.message);
      allPassed = false;
    }

    // -----------------------------------------------------------------
    // TEST 5: Test Incorrect Password Rejection
    // -----------------------------------------------------------------
    console.log('\n[TEST 5] Testing Admin Login with INCORRECT password...');
    try {
      await authService.loginAdmin({
        username: 'rangoliadmin',
        password: 'WrongPassword!123',
      });
      console.error('❌ FAILED: Incorrect password was incorrectly accepted!');
      allPassed = false;
    } catch (err: any) {
      console.log(`✅ PASSED: Incorrect password correctly rejected (${err.message})`);
    }

    // -----------------------------------------------------------------
    // TEST 6: Test Customer Rejection from Admin Login
    // -----------------------------------------------------------------
    console.log('\n[TEST 6] Testing Customer Account Rejection from Admin Login...');
    // Ensure a test customer account exists
    let testCustomer = await prisma.user.findFirst({
      where: { email: 'customer_test@example.com' },
    });

    if (!testCustomer) {
      const bcrypt = require('bcryptjs');
      testCustomer = await prisma.user.create({
        data: {
          email: 'customer_test@example.com',
          username: 'customertest',
          fullName: 'Test Customer',
          passwordHash: await bcrypt.hash('CustomerPass123!', 10),
          role: UserRole.CUSTOMER,
          isActive: true,
        },
      });
    }

    try {
      await authService.loginAdmin({
        username: 'customer_test@example.com',
        password: 'CustomerPass123!',
      });
      console.error('❌ FAILED: Customer account was allowed into admin login!');
      allPassed = false;
    } catch (err: any) {
      console.log(`✅ PASSED: Customer account rejected from admin login: "${err.message}"`);
    }

    // -----------------------------------------------------------------
    // TEST 7: Test Admin Dashboard / Profile Access
    // -----------------------------------------------------------------
    console.log('\n[TEST 7] Testing Admin Profile Access (/auth/me)...');
    try {
      const profile = await authService.getProfile(adminUser!.id);
      console.log('✅ PASSED: Admin profile successfully retrieved:');
      console.log(`   - Username: ${profile.username}`);
      console.log(`   - Role: ${profile.role}`);
    } catch (err: any) {
      console.error('❌ FAILED: Profile access failed:', err.message);
      allPassed = false;
    }

    // -----------------------------------------------------------------
    // TEST 8: Confirm Customer Authentication Still Works
    // -----------------------------------------------------------------
    console.log('\n[TEST 8] Confirming Customer Login still works via Customer portal...');
    try {
      const customerLogin = await authService.loginCustomer({
        email: 'customer_test@example.com',
        password: 'CustomerPass123!',
      });
      console.log('✅ PASSED: Customer login works seamlessly:');
      console.log(`   - Email: ${customerLogin.user.email}`);
      console.log(`   - Role: ${customerLogin.user.role}`);
      console.log(`   - Tokens Generated: ${customerLogin.tokens.accessToken.substring(0, 30)}...`);
    } catch (err: any) {
      console.error('❌ FAILED: Customer login failed:', err.message);
      allPassed = false;
    }

    console.log('\n======================================================');
    if (allPassed) {
      console.log('🎯 ALL 8 FINAL VERIFICATION TESTS PASSED SUCCESSFULLY!');
    } else {
      console.log('⚠️ SOME TESTS ENCOUNTERED FAILURES');
    }
    console.log('======================================================\n');
  } finally {
    await prisma.$disconnect();
    await prismaService.$disconnect();
  }
}

runVerification();

