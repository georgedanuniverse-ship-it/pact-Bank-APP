export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const beneficiaries = await prisma.beneficiary.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ beneficiaries });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beneficiaries' },
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
    const { name, accountNumber, bankName, bankCode, type } = body;

    if (!name || !accountNumber || !bankName || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const beneficiary = await prisma.beneficiary.create({
      data: {
        userId: session.user.id,
        name,
        accountNumber,
        bankName,
        bankCode: bankCode || '',
        type,
      },
    });

    return NextResponse.json({ beneficiary }, { status: 201 });
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    return NextResponse.json(
      { error: 'Failed to create beneficiary' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Beneficiary ID required' },
        { status: 400 }
      );
    }

    await prisma.beneficiary.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ message: 'Beneficiary deleted' });
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    return NextResponse.json(
      { error: 'Failed to delete beneficiary' },
      { status: 500 }
    );
  }
}
