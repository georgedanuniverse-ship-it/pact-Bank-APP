import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccountNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || '',
        name: `${firstName} ${lastName}`,
        role: 'user',
      },
    });

    // Create default savings account for new user
    await prisma.bankAccount.create({
      data: {
        userId: user.id,
        accountNumber: generateAccountNumber(),
        accountType: 'Savings',
        balance: 0,
        currency: 'USD',
        status: 'active',
      },
    });

    // Create security settings
    await prisma.securitySettings.create({
      data: {
        userId: user.id,
        twoFactorEnabled: false,
        sessionTimeout: 30,
        loginNotifications: true,
        transactionAlerts: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
