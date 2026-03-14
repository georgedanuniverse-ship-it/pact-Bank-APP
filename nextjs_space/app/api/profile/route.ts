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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        name: true,
        accountType: true,
        businessName: true,
        businessPhone: true,
        businessEmail: true,
        businessAddress: true,
        businessWebsite: true,
        taxId: true,
        registrationNumber: true,
        country: true,
        industry: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone } = body;

    const updateData: any = {
      firstName,
      lastName,
      phone,
      name: `${firstName} ${lastName}`,
    };

    // Allow corporate users to update business fields
    if (session.user.accountType === 'corporate') {
      if (body.businessName !== undefined) updateData.businessName = body.businessName;
      if (body.businessPhone !== undefined) updateData.businessPhone = body.businessPhone;
      if (body.businessEmail !== undefined) updateData.businessEmail = body.businessEmail;
      if (body.businessAddress !== undefined) updateData.businessAddress = body.businessAddress;
      if (body.businessWebsite !== undefined) updateData.businessWebsite = body.businessWebsite;
      if (body.taxId !== undefined) updateData.taxId = body.taxId;
      if (body.registrationNumber !== undefined) updateData.registrationNumber = body.registrationNumber;
      if (body.country !== undefined) updateData.country = body.country;
      if (body.industry !== undefined) updateData.industry = body.industry;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
