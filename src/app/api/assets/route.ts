
import { NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateAssetAPISchema } from '@/lib/types';
import { z } from 'zod';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}


// GET handler to fetch all assets
export async function GET(request: Request) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        machineName: 'asc'
      }
    });
    return NextResponse.json(assets, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500, headers: corsHeaders });
  }
}

// POST handler to create a new asset
export async function POST(request: Request) {
  try {
    const rawText = await request.text();
    let body: any;
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.error('Failed to parse JSON body for create asset:', parseError);
      console.error('Raw request body:', rawText);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
    }

    const validatedData = CreateAssetAPISchema.parse(body);

    const dataToCreate = validatedData as any;

    // Check for duplicates based on manufacturer and serial number
    if (validatedData.manufacturer && validatedData.serialNumber) {
      const existingAsset = await prisma.asset.findFirst({
        where: {
          manufacturer: validatedData.manufacturer,
          serialNumber: validatedData.serialNumber,
        },
      });

      if (existingAsset) {
        return NextResponse.json({ error: 'Duplicate Asset', message: `An asset with the same manufacturer and serial number already exists: ${existingAsset.machineName}` }, { status: 409, headers: corsHeaders });
      }
    }

    const newAsset = await prisma.asset.create({
      data: {
        ...dataToCreate,
        owner: 'Group Administrators',
      },
    });
    return NextResponse.json(newAsset, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Failed to create asset:', error);
    // Handle zod validation errors
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation failed', details: error.flatten() }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500, headers: corsHeaders });
  }
}

// DELETE handler for bulk deletion
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { ids } = z.object({ ids: z.array(z.string()) }).parse(body);

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: 'No asset IDs provided for deletion' }, { status: 400, headers: corsHeaders });
    }

    await prisma.asset.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return new NextResponse(null, { status: 204, headers: corsHeaders }); // No Content
  } catch (error) {
    console.error('Failed to delete assets:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body for bulk delete' }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: 'Failed to delete assets' }, { status: 500, headers: corsHeaders });
  }
}
