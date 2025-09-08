
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { UpdateAssetAPISchema } from '@/lib/types';

const prisma = new PrismaClient();

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
                              return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
                                  }
                                      return NextResponse.json(asset);
                                        } catch (error) {
                                            console.error('Failed to fetch asset:', error);
                                                return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
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
                                                                                                              return NextResponse.json(updatedAsset);
                                                                                                                } catch (error) {
                                                                                                                    console.error('Failed to update asset:', error);
                                                                                                                        return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
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
                                                                                                                                                  return new NextResponse(null, { status: 204 }); // No Content
                                                                                                                                                    } catch (error) {
                                                                                                                                                        console.error('Failed to delete asset:', error);
                                                                                                                                                            return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
                                                                                                                                                              }
                                                                                                                                                              }
