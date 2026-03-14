import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const AFRICAN_NAMES = [
  { firstName: 'Amara', lastName: 'Okonkwo' },
  { firstName: 'Kwame', lastName: 'Mensah' },
  { firstName: 'Zainab', lastName: 'Hassan' },
  { firstName: 'Thabo', lastName: 'Nkosi' },
  { firstName: 'Fatima', lastName: 'Diallo' },
  { firstName: 'Kofi', lastName: 'Adu' },
  { firstName: 'Nia', lastName: 'Mwangi' },
  { firstName: 'Chike', lastName: 'Okafor' },
];

const TRANSACTION_DESCRIPTIONS = [
  { desc: 'Salary Payment - Tech Solutions Ltd', type: 'credit', category: 'salary' },
  { desc: 'Transfer to Amara Okonkwo', type: 'debit', category: 'transfer' },
  { desc: 'MTN Airtime Purchase', type: 'debit', category: 'airtime' },
  { desc: 'EKEDC Electricity Bill', type: 'debit', category: 'utilities' },
  { desc: 'Shoprite Purchase - Lagos', type: 'debit', category: 'shopping' },
  { desc: 'Client Payment - Web Development', type: 'credit', category: 'business' },
  { desc: 'Uber Ride - Nairobi CBD', type: 'debit', category: 'transport' },
  { desc: 'Investment Return - PACT Bonds', type: 'credit', category: 'investment' },
  { desc: 'Internet Bill - Smile Communications', type: 'debit', category: 'utilities' },
  { desc: 'Transfer from Kwame Mensah', type: 'credit', category: 'transfer' },
  { desc: 'Restaurant - The Place Lekki', type: 'debit', category: 'dining' },
  { desc: 'Freelance Payment - Design Work', type: 'credit', category: 'freelance' },
  { desc: 'DSTV Subscription', type: 'debit', category: 'entertainment' },
  { desc: 'Water Bill - Lagos Water Corp', type: 'debit', category: 'utilities' },
  { desc: 'ATM Withdrawal - Victoria Island', type: 'debit', category: 'cash' },
];

const BILLERS = [
  { name: 'EKEDC', category: 'electricity' },
  { name: 'IKEDC', category: 'electricity' },
  { name: 'Kenya Power & Lighting', category: 'electricity' },
  { name: 'Smile Communications', category: 'internet' },
  { name: 'Safaricom', category: 'internet' },
  { name: 'MTN', category: 'airtime' },
  { name: 'Airtel', category: 'airtime' },
  { name: 'Vodacom', category: 'airtime' },
  { name: 'Lagos Water Corporation', category: 'water' },
  { name: 'Nairobi Water', category: 'water' },
  { name: 'DSTV', category: 'entertainment' },
  { name: 'GOtv', category: 'entertainment' },
];

function generateAccountNumber(): string {
  return '30' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}

function generateReferenceNumber(): string {
  return 'PACT' + Date.now() + Math.floor(Math.random() * 10000);
}

function getRandomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Hash passwords for users
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const adminHashedPassword = await bcrypt.hash('admin123', 10);

  // Create default admin test user (system)
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+234-801-234-5678',
      name: 'John Doe',
      role: 'admin',
    },
  });

  // Create Pact Bank branded admin account
  const pactAdmin = await prisma.user.upsert({
    where: { email: 'admin@pact-bank.com' },
    update: { password: adminHashedPassword },
    create: {
      email: 'admin@pact-bank.com',
      password: adminHashedPassword,
      firstName: 'Admin',
      lastName: 'Pact',
      phone: '+234-800-PACT-BNK',
      name: 'Pact Admin',
      role: 'admin',
    },
  });

  console.log('✅ Admin users created:', adminUser.email, pactAdmin.email);

  // Create additional sample users
  const users = [];
  for (let i = 0; i < 3; i++) {
    const name = AFRICAN_NAMES[i];
    const user = await prisma.user.upsert({
      where: { email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@example.com` },
      update: {},
      create: {
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}@example.com`,
        password: hashedPassword,
        firstName: name.firstName,
        lastName: name.lastName,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        name: `${name.firstName} ${name.lastName}`,
        role: 'user',
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length} sample users`);

  // Create bank accounts for admin user
  const savingsAccount = await prisma.bankAccount.upsert({
    where: { accountNumber: '3001234567' },
    update: {},
    create: {
      userId: adminUser.id,
      accountNumber: '3001234567',
      accountType: 'Savings',
      balance: 125450.75,
      currency: 'USD',
      status: 'active',
    },
  });

  const currentAccount = await prisma.bankAccount.upsert({
    where: { accountNumber: '3001234568' },
    update: {},
    create: {
      userId: adminUser.id,
      accountNumber: '3001234568',
      accountType: 'Current',
      balance: 3250000.00,
      currency: 'NGN',
      status: 'active',
    },
  });

  const fixedDepositAccount = await prisma.bankAccount.upsert({
    where: { accountNumber: '3001234569' },
    update: {},
    create: {
      userId: adminUser.id,
      accountNumber: '3001234569',
      accountType: 'Fixed Deposit',
      balance: 50000.00,
      currency: 'USD',
      status: 'active',
    },
  });

  // Create bank accounts for pactAdmin user
  const pactSavings = await prisma.bankAccount.upsert({
    where: { accountNumber: '3002000001' },
    update: {},
    create: {
      userId: pactAdmin.id,
      accountNumber: '3002000001',
      accountType: 'Savings',
      balance: 87250.50,
      currency: 'USD',
      status: 'active',
    },
  });

  const pactCurrent = await prisma.bankAccount.upsert({
    where: { accountNumber: '3002000002' },
    update: {},
    create: {
      userId: pactAdmin.id,
      accountNumber: '3002000002',
      accountType: 'Current',
      balance: 2100000.00,
      currency: 'NGN',
      status: 'active',
    },
  });

  // Create transactions for pactAdmin savings
  for (let i = 0; i < 15; i++) {
    const txn = TRANSACTION_DESCRIPTIONS[i % TRANSACTION_DESCRIPTIONS.length];
    const amount = Math.floor(Math.random() * 30000) + 200;
    await prisma.transaction.create({
      data: {
        accountId: pactSavings.id,
        type: txn.type,
        amount,
        currency: 'USD',
        description: txn.desc,
        category: txn.category,
        recipientName: txn.type === 'debit' ? AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].firstName + ' ' + AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].lastName : undefined,
        recipientAccount: txn.type === 'debit' ? generateAccountNumber() : undefined,
        referenceNumber: generateReferenceNumber(),
        status: 'completed',
        createdAt: getRandomDate(60),
      },
    });
  }

  // Create security settings for pactAdmin
  await prisma.securitySettings.upsert({
    where: { userId: pactAdmin.id },
    update: {},
    create: {
      userId: pactAdmin.id,
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true,
      transactionAlerts: true,
    },
  });

  console.log('✅ Created bank accounts');

  // Create bank accounts for other users
  const userAccounts = [];
  for (const user of users) {
    const account = await prisma.bankAccount.create({
      data: {
        userId: user.id,
        accountNumber: generateAccountNumber(),
        accountType: ['Savings', 'Current'][Math.floor(Math.random() * 2)],
        balance: Math.floor(Math.random() * 500000) + 10000,
        currency: ['USD', 'NGN', 'KES', 'ZAR'][Math.floor(Math.random() * 4)],
        status: 'active',
      },
    });
    userAccounts.push(account);
  }

  // Create transactions for admin's savings account (last 90 days)
  const transactions = [];
  for (let i = 0; i < 25; i++) {
    const txn = TRANSACTION_DESCRIPTIONS[i % TRANSACTION_DESCRIPTIONS.length];
    const amount = Math.floor(Math.random() * 50000) + 100;
    
    await prisma.transaction.create({
      data: {
        accountId: savingsAccount.id,
        type: txn.type,
        amount: amount,
        currency: 'USD',
        description: txn.desc,
        category: txn.category,
        recipientName: txn.type === 'debit' ? AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].firstName + ' ' + AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].lastName : undefined,
        recipientAccount: txn.type === 'debit' ? generateAccountNumber() : undefined,
        referenceNumber: generateReferenceNumber(),
        status: 'completed',
        createdAt: getRandomDate(90),
      },
    });
  }

  // Create transactions for admin's current account (NGN)
  for (let i = 0; i < 30; i++) {
    const txn = TRANSACTION_DESCRIPTIONS[i % TRANSACTION_DESCRIPTIONS.length];
    const amount = Math.floor(Math.random() * 500000) + 1000;
    
    await prisma.transaction.create({
      data: {
        accountId: currentAccount.id,
        type: txn.type,
        amount: amount,
        currency: 'NGN',
        description: txn.desc,
        category: txn.category,
        recipientName: txn.type === 'debit' ? AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].firstName + ' ' + AFRICAN_NAMES[Math.floor(Math.random() * AFRICAN_NAMES.length)].lastName : undefined,
        recipientAccount: txn.type === 'debit' ? generateAccountNumber() : undefined,
        referenceNumber: generateReferenceNumber(),
        status: Math.random() > 0.95 ? 'pending' : 'completed',
        createdAt: getRandomDate(60),
      },
    });
  }

  console.log('✅ Created transactions');

  // Create beneficiaries for admin user
  const beneficiaries = [
    {
      userId: adminUser.id,
      name: 'Amara Okonkwo',
      accountNumber: '3009876543',
      bankName: 'Pact Bank',
      type: 'internal',
    },
    {
      userId: adminUser.id,
      name: 'Kwame Mensah',
      accountNumber: '0123456789',
      bankName: 'Access Bank',
      bankCode: '044',
      type: 'external',
    },
    {
      userId: adminUser.id,
      name: 'Zainab Hassan',
      accountNumber: '9876543210',
      bankName: 'Zenith Bank',
      bankCode: '057',
      type: 'external',
    },
    {
      userId: adminUser.id,
      name: 'Thabo Nkosi',
      accountNumber: 'ZA1234567890',
      bankName: 'Standard Bank South Africa',
      type: 'international',
    },
  ];

  for (const ben of beneficiaries) {
    await prisma.beneficiary.create({
      data: ben,
    });
  }

  console.log('✅ Created beneficiaries');

  // Create bill payments for admin user
  for (let i = 0; i < 15; i++) {
    const biller = BILLERS[i % BILLERS.length];
    await prisma.billPayment.create({
      data: {
        userId: adminUser.id,
        billerName: biller.name,
        billerCategory: biller.category,
        accountNumber: Math.floor(Math.random() * 10000000000).toString(),
        amount: Math.floor(Math.random() * 10000) + 500,
        currency: 'NGN',
        referenceNumber: generateReferenceNumber(),
        status: 'completed',
        createdAt: getRandomDate(60),
      },
    });
  }

  console.log('✅ Created bill payments');

  // Create activity logs for admin user
  const activities = [
    { action: 'login', description: 'Successful login from Chrome', device: 'Desktop - Chrome', location: 'Lagos, Nigeria', ipAddress: '197.210.55.10' },
    { action: 'login', description: 'Successful login from Mobile App', device: 'iPhone 14 Pro', location: 'Nairobi, Kenya', ipAddress: '105.112.33.45' },
    { action: 'transfer', description: 'Transfer of $5,000 to Amara Okonkwo', device: 'Desktop - Safari', location: 'Accra, Ghana', ipAddress: '154.160.12.88' },
    { action: 'password_change', description: 'Password changed successfully', device: 'Desktop - Firefox', location: 'Lagos, Nigeria', ipAddress: '197.210.55.10' },
    { action: 'login', description: 'Failed login attempt', device: 'Unknown', location: 'Unknown', ipAddress: '45.33.22.11', status: 'failed' },
    { action: 'bill_payment', description: 'EKEDC bill payment of ₦15,000', device: 'Mobile - Android', location: 'Abuja, Nigeria', ipAddress: '197.210.70.25' },
  ];

  for (const activity of activities) {
    await prisma.activityLog.create({
      data: {
        userId: adminUser.id,
        action: activity.action,
        description: activity.description,
        device: activity.device,
        location: activity.location,
        ipAddress: activity.ipAddress,
        status: activity.status || 'success',
        createdAt: getRandomDate(30),
      },
    });
  }

  console.log('✅ Created activity logs');

  // Create security settings for admin user
  await prisma.securitySettings.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true,
      transactionAlerts: true,
    },
  });

  // Create security settings for other users
  for (const user of users) {
    await prisma.securitySettings.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginNotifications: true,
        transactionAlerts: true,
      },
    });
  }

  console.log('✅ Created security settings');

  // ===== CORPORATE TEST ACCOUNT =====
  const corporateHashedPassword = await bcrypt.hash('corporate123', 10);
  const corporateUser = await prisma.user.upsert({
    where: { email: 'corporate@pact-bank.com' },
    update: { password: corporateHashedPassword },
    create: {
      email: 'corporate@pact-bank.com',
      password: corporateHashedPassword,
      firstName: 'Ngozi',
      lastName: 'Adeyemi',
      phone: '+234-802-555-0100',
      name: 'Ngozi Adeyemi',
      role: 'user',
      accountType: 'corporate',
      businessName: 'AfriTech Solutions Ltd',
      businessPhone: '+234-1-555-0200',
      businessEmail: 'info@afritech-solutions.com',
      businessAddress: '15 Victoria Island, Lagos, Nigeria',
      businessWebsite: 'https://afritech-solutions.com',
      taxId: 'NG-TIN-12345678',
      registrationNumber: 'RC-987654',
      country: 'Nigeria',
      industry: 'Technology',
    },
  });

  // Corporate Business Current Account - USD
  const corpUSDAccount = await prisma.bankAccount.upsert({
    where: { accountNumber: '3005000001' },
    update: {},
    create: {
      userId: corporateUser.id,
      accountNumber: '3005000001',
      accountType: 'Business Current',
      balance: 875000.00,
      currency: 'USD',
      status: 'active',
    },
  });

  // Corporate Business Current Account - NGN
  const corpNGNAccount = await prisma.bankAccount.upsert({
    where: { accountNumber: '3005000002' },
    update: {},
    create: {
      userId: corporateUser.id,
      accountNumber: '3005000002',
      accountType: 'Business Current',
      balance: 42500000.00,
      currency: 'NGN',
      status: 'active',
    },
  });

  // Corporate Fixed Deposit
  await prisma.bankAccount.upsert({
    where: { accountNumber: '3005000003' },
    update: {},
    create: {
      userId: corporateUser.id,
      accountNumber: '3005000003',
      accountType: 'Fixed Deposit',
      balance: 250000.00,
      currency: 'USD',
      status: 'active',
    },
  });

  // Corporate transactions (USD account)
  const CORP_TRANSACTIONS = [
    { desc: 'Monthly Payroll - March 2026', type: 'debit', category: 'payroll', amount: 48200 },
    { desc: 'Client Payment - Tech Solutions Project', type: 'credit', category: 'revenue', amount: 125000 },
    { desc: 'Office Rent - Victoria Island', type: 'debit', category: 'rent', amount: 15000 },
    { desc: 'AWS Cloud Infrastructure', type: 'debit', category: 'technology', amount: 8500 },
    { desc: 'Government Contract Payment', type: 'credit', category: 'revenue', amount: 250000 },
    { desc: 'Employee Travel Expenses', type: 'debit', category: 'travel', amount: 4200 },
    { desc: 'Software License Renewal', type: 'debit', category: 'technology', amount: 12000 },
    { desc: 'Partnership Revenue - FinTech Co.', type: 'credit', category: 'revenue', amount: 75000 },
    { desc: 'Insurance Premium', type: 'debit', category: 'insurance', amount: 6800 },
    { desc: 'Export Payment - Accra Office', type: 'credit', category: 'revenue', amount: 95000 },
  ];

  for (let i = 0; i < CORP_TRANSACTIONS.length; i++) {
    const txn = CORP_TRANSACTIONS[i];
    await prisma.transaction.create({
      data: {
        accountId: corpUSDAccount.id,
        type: txn.type,
        amount: txn.amount,
        currency: 'USD',
        description: txn.desc,
        category: txn.category,
        recipientName: txn.type === 'debit' ? 'Various' : undefined,
        referenceNumber: generateReferenceNumber(),
        status: 'completed',
        createdAt: getRandomDate(60),
      },
    });
  }

  // Corporate security settings
  await prisma.securitySettings.upsert({
    where: { userId: corporateUser.id },
    update: {},
    create: {
      userId: corporateUser.id,
      twoFactorEnabled: true,
      sessionTimeout: 15,
      loginNotifications: true,
      transactionAlerts: true,
    },
  });

  console.log('✅ Created corporate test account:', corporateUser.email, '/ corporate123');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
