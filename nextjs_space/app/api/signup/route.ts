import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateAccountNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, accountType } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const type = accountType === 'corporate' ? 'corporate' : 'personal';

    // Validate corporate fields
    if (type === 'corporate') {
      const { businessName, industry, country } = body;
      if (!businessName || !industry || !country) {
        return NextResponse.json(
          { error: 'Business name, industry, and country are required for corporate accounts' },
          { status: 400 }
        );
      }
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

    const userData: any = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || '',
      name: `${firstName} ${lastName}`,
      role: 'user',
      accountType: type,
    };

    // Add corporate fields if corporate account
    if (type === 'corporate') {
      userData.businessName = body.businessName || '';
      userData.businessPhone = body.businessPhone || '';
      userData.businessEmail = body.businessEmail || '';
      userData.businessAddress = body.businessAddress || '';
      userData.businessWebsite = body.businessWebsite || '';
      userData.taxId = body.taxId || '';
      userData.registrationNumber = body.registrationNumber || '';
      userData.country = body.country || '';
      userData.industry = body.industry || '';
    }

    const user = await prisma.user.create({ data: userData });

    // Create default accounts based on account type
    if (type === 'corporate') {
      // Corporate gets a Business Current Account (USD) and a Business Current Account (NGN)
      await prisma.bankAccount.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(),
          accountType: 'Business Current',
          balance: 0,
          currency: 'USD',
          status: 'active',
        },
      });
      await prisma.bankAccount.create({
        data: {
          userId: user.id,
          accountNumber: generateAccountNumber(),
          accountType: 'Business Current',
          balance: 0,
          currency: 'NGN',
          status: 'active',
        },
      });
    } else {
      // Personal gets a Savings account
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
    }

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
        message: 'Account created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: type,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
