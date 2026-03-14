export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReferenceNumber } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const billPayments = await prisma.billPayment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ billPayments });
  } catch (error) {
    console.error('Error fetching bill payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill payments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { billerName, billerCategory, accountNumber, amount, currency, fromAccountId } = body;

    if (!billerName || !billerCategory || !accountNumber || !amount || !fromAccountId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify account belongs to user and has sufficient balance
    const account = await prisma.bankAccount.findUnique({
      where: { id: fromAccountId, userId: session.user.id },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if ((account?.balance ?? 0) < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    const reference = generateReferenceNumber();

    // Create bill payment record
    const billPayment = await prisma.billPayment.create({
      data: {
        userId: session.user.id,
        billerName,
        billerCategory,
        accountNumber,
        amount,
        currency: currency || 'USD',
        referenceNumber: reference,
        status: 'completed',
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        accountId: fromAccountId,
        type: 'debit',
        amount,
        currency: account.currency,
        description: `${billerName} Bill Payment`,
        category: billerCategory,
        recipientName: billerName,
        recipientAccount: accountNumber,
        referenceNumber: reference,
        status: 'completed',
      },
    });

    // Update account balance
    await prisma.bankAccount.update({
      where: { id: fromAccountId },
      data: { balance: (account?.balance ?? 0) - amount },
    });

    return NextResponse.json(
      {
        message: 'Bill payment successful',
        billPayment,
        reference,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing bill payment:', error);
    return NextResponse.json(
      { error: 'Failed to process bill payment' },
      { status: 500 }
    );
  }
}
