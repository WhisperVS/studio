
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateAssetAPISchema } from '@/lib/types';
import { z } from 'zod';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}


// GET handler to fetch all assets
export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        machineName: 'asc'
      }
    });

    // No mapping needed - the database already contains the display values
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
    let body: unknown;
    try {
      body = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.error('Failed to parse JSON body for create asset:', parseError);
      console.error('Raw request body:', rawText);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
    }

    // Parse & validate with Zod. Use the schema's inferred type for safety.
    const validatedData = CreateAssetAPISchema.parse(body);

    type CreateAssetInput = z.infer<typeof CreateAssetAPISchema>;
    const dataToCreate = validatedData as CreateAssetInput;

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

    // Map display values to enum values before database operations
    const mapDisplayToEnum = (data: any) => {
      // No mapping needed - database stores display values directly
      return data;
    };

    // Sanitize input: only pass fields that exist on the Prisma model.
    const allowedKeys = new Set([
      'machineName','category','os','location','manufacturer','partNumber','modelNumber','serialNumber',
      'type','webui','assignedUser','userId','userType','owner','status','notes',
      'purchaseDate','warrantyExpirationDate','createdBy','updatedBy'
    ]);

  const sanitizedData: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(dataToCreate)) {
      if (allowedKeys.has(k)) sanitizedData[k] = v;
    }

    // Ensure owner is set server-side
    sanitizedData.owner = 'Group Administrators';

    // Map display values to database enum values
    const mappedData = mapDisplayToEnum(sanitizedData);

  // mappedData is built dynamically; cast to Prisma's input type via unknown to avoid `any`
  const newAsset = await prisma.asset.create({ data: mappedData as unknown as Prisma.AssetCreateInput });
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
