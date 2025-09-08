
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CreateAssetAPISchema } from '@/lib/types';

const prisma = new PrismaClient();

// GET handler to fetch all assets
export async function GET(request: Request) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        machineName: 'asc'
      }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

// POST handler to create a new asset
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = CreateAssetAPISchema.parse(body);

    const newAsset = await prisma.asset.create({
      data: {
        ...validatedData,
        owner: 'Group Administrators',
      },
    });
    return NextResponse.json(newAsset, { status: 201 });
  } catch (error) {
    console.error('Failed to create asset:', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}
