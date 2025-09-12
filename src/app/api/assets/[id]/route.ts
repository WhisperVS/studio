
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { UpdateAssetAPISchema } from '@/lib/types';

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
                                      return NextResponse.json(asset, { headers: corsHeaders });
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

                                                                    const updatedAsset = await prisma.asset.update({
                                                                          where: { id: params.id },
                                                                                data: {
                                                                                        ...validatedData,
                                                                                                owner: 'Group Administrators',
                                                                                                      },
                                                                                                          });
                                                                                                              return NextResponse.json(updatedAsset, { headers: corsHeaders });
                                                                                                                } catch (error) {
                                                                                                                    console.error('Failed to update asset:', error);
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
