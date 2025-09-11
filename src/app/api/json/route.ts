
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET handler to fetch all assets and format them for the JSON endpoint
export async function GET(request: Request) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: {
        machineName: 'asc'
      }
    });

    // Transform the data to match the desired JSON format
    const formattedData = assets.map(asset => ({
      type: asset.category,
      status: asset.status,
      id: asset.machineName, // Mapping machineName to id as in the example
      manufacturer: asset.manufacturer,
      model: asset.modelNumber,
      os: asset.os,
      assigned_user: asset.assignedUser,
      user_id: asset.userId,
      //quantity: "1", // Defaulting quantity to "1" as it's not in the base model
      location: asset.location,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
    
  } catch (error) {
    console.error('Failed to fetch assets for JSON endpoint:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch assets' 
      }, 
      { status: 500 }
    );
  }
}
