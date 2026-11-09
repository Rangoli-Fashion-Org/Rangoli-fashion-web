import { PrismaClient, UserRole, SettingGroup } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Rangoli Fashions System Bootstrap ---');

  // 1. Initial Admin Bootstrap
  const adminEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@rangolifashions.com').toLowerCase();
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminChangeMe123!';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Rangoli Super Admin';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: adminName,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
    });
    console.log(`[BOOTSTRAP] Initial super admin created: ${adminEmail}`);
  } else {
    console.log(`[BOOTSTRAP] Admin user ${adminEmail} already exists`);
  }

  // 2. Initial System Settings (Single source of truth)
  const defaultSettings = [
    { key: 'site_name', value: 'Rangoli Fashions', group: SettingGroup.GENERAL },
    { key: 'currency', value: 'INR', group: SettingGroup.GENERAL },
    { key: 'currency_symbol', value: '₹', group: SettingGroup.GENERAL },
    { key: 'free_shipping_threshold', value: '1999', group: SettingGroup.SHIPPING },
    { key: 'standard_shipping_fee', value: '99', group: SettingGroup.SHIPPING },
    { key: 'announcement_bar_text', value: 'Free Shipping on Orders Above ₹1,999 | Easy Returns | Secure Payments', group: SettingGroup.GENERAL },
    { key: 'return_policy_days', value: '7', group: SettingGroup.POLICY },
    { key: 'return_policy_text', value: 'Hassle-free 7-day returns on unworn items with original tags and packaging.', group: SettingGroup.POLICY },
    { key: 'terms_and_conditions', value: 'Welcome to Rangoli Fashions. By shopping with us, you agree to our terms of service.', group: SettingGroup.POLICY },
    { key: 'privacy_policy', value: 'Rangoli Fashions respects your privacy and protects your personal information with industry-standard encryption.', group: SettingGroup.POLICY },
    { key: 'cod_enabled', value: 'true', group: SettingGroup.PAYMENT },
    { key: 'razorpay_enabled', value: 'true', group: SettingGroup.PAYMENT },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log('[BOOTSTRAP] Store configuration initialized');

  // 3. Homepage CMS Layout Sections
  const defaultSections = [
    { sectionKey: 'hero_banner', title: 'Hero Banner', displayOrder: 1, isVisible: true },
    { sectionKey: 'shopping_benefits', title: 'Shopping Benefits Bar', displayOrder: 2, isVisible: true },
    { sectionKey: 'shop_by_category', title: 'Shop by Category', displayOrder: 3, isVisible: true },
    { sectionKey: 'festive_edit', title: 'Festive Edit', displayOrder: 4, isVisible: true },
    { sectionKey: 'new_arrivals', title: 'New Arrivals', displayOrder: 5, isVisible: true },
    { sectionKey: 'why_choose_us', title: 'Why Choose Rangoli', displayOrder: 6, isVisible: true },
    { sectionKey: 'brand_benefits', title: 'Designed with Devotion, Made to Cherish', displayOrder: 7, isVisible: true },
    { sectionKey: 'rangoli_prime_circle', title: 'The Rangoli Prime Circle', displayOrder: 8, isVisible: true },
  ];

  for (const sec of defaultSections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: {},
      create: sec,
    });
  }
  console.log('[BOOTSTRAP] Homepage CMS sections registered');

  // 4. Contact Information
  const existingContact = await prisma.contactInformation.findFirst();
  if (!existingContact) {
    await prisma.contactInformation.create({
      data: {
        storeName: 'Rangoli Fashions',
        email: 'support@rangolifashions.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: '42, Silk Heritage Lane, Fashion District',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        postalCode: '302001',
        businessHours: 'Mon - Sat: 10:00 AM - 8:00 PM IST',
      },
    });
    console.log('[BOOTSTRAP] Contact information registered');
  }

  // 5. Social Links
  const socialLinks = [
    { platform: 'Instagram', url: 'https://instagram.com/rangolifashions', icon: 'instagram', displayOrder: 1 },
    { platform: 'Facebook', url: 'https://facebook.com/rangolifashions', icon: 'facebook', displayOrder: 2 },
    { platform: 'YouTube', url: 'https://youtube.com/rangolifashions', icon: 'youtube', displayOrder: 3 },
    { platform: 'WhatsApp', url: 'https://wa.me/919876543210', icon: 'whatsapp', displayOrder: 4 },
  ];

  for (const sl of socialLinks) {
    await prisma.socialLink.upsert({
      where: { platform: sl.platform },
      update: {},
      create: { ...sl, isActive: true },
    });
  }
  console.log('[BOOTSTRAP] Social links initialized');

  console.log('--- Rangoli Fashions Bootstrap Complete ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

