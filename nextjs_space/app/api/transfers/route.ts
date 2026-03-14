export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateReferenceNumber } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fromAccountId, toAccountNumber, amount, description, recipientName, transferType } = body;

    if (!fromAccountId || !toAccountNumber || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify from account belongs to user
    const fromAccount = await prisma.bankAccount.findUnique({
      where: { id: fromAccountId, userId: session.user.id },
    });

    if (!fromAccount) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    if ((fromAccount?.balance ?? 0) < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create debit transaction
    const transaction = await prisma.transaction.create({
      data: {
        accountId: fromAccountId,
        type: 'debit',
        amount,
        currency: fromAccount.currency,
        description,
        category: 'transfer',
        recipientName: recipientName || 'Unknown',
        recipientAccount: toAccountNumber,
        referenceNumber: generateReferenceNumber(),
        status: 'completed',
      },
    });

    // Update account balance
    await prisma.bankAccount.update({
      where: { id: fromAccountId },
      data: { balance: (fromAccount?.balance ?? 0) - amount },
    });

    return NextResponse.json(
      {
        message: 'Transfer successful',
        transaction,
        reference: transaction.referenceNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing transfer:', error);
    return NextResponse.json(
      { error: 'Failed to process transfer' },
      { status: 500 }
    );
  }
}
