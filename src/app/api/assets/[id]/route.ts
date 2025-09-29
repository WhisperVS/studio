
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { UpdateAssetAPISchema } from '@/lib/types';
import { z } from 'zod';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper functions for enum mapping
const mapEnumToDisplay = (asset: any) => {
  // No mapping needed - database already contains display values
  return asset;
};

const mapDisplayToEnum = (data: any) => {
  // No mapping needed - database stores display values directly
  return data;
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET handler to fetch a single asset
export async function GET(
  request: Request,
    { params }: { params: { id: string } }
    ) {
      try {
          const asset = await prisma.asset.findUnique({
                where: { id: params.id },
                    });
                        if (!asset) {
                              return NextResponse.json({ error: 'Asset not found' }, { status: 404, headers: corsHeaders });
                                  }
                                  
                                  // Map enum values to display values
                                  const mappedAsset = mapEnumToDisplay(asset);
                                  
                                      return NextResponse.json(mappedAsset, { headers: corsHeaders });
                                        } catch (error) {
                                            console.error('Failed to fetch asset:', error);
                                                return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500, headers: corsHeaders });
                                                  }
                                                  }


// PUT handler to update an asset
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = UpdateAssetAPISchema.parse(body);

    // Map display values to enum values
    const mappedData = mapDisplayToEnum({
      ...validatedData,
      owner: 'Group Administrators',
    });

    const updatedAsset = await prisma.asset.update({
      where: { id: params.id },
      data: mappedData,
    });
    
    // Map enum values back to display values for response
    const responseAsset = mapEnumToDisplay(updatedAsset);
    
    return NextResponse.json(responseAsset, { headers: corsHeaders });
  } catch (error) {
    console.error('Failed to update asset:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.flatten() }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500, headers: corsHeaders });
  }
}

// DELETE handler
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.asset.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204, headers: corsHeaders }); // No Content
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500, headers: corsHeaders });
  }
}
