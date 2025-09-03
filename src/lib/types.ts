import { z } from 'zod';
import { CATEGORIES, LOCATIONS, STATUSES, USER_TYPES } from './constants';

export const AssetSchema = z.object({
  id: z.string(),
  machineName: z.string().min(1, 'Machine name is required'),
  category: z.enum(CATEGORIES),
  systemOS: z.string().optional().default(''),
  location: z.enum(LOCATIONS),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  partNumber: z.string().optional().default(''),
  modelNumber: z.string().optional().default(''),
  serialNumber: z.string().optional().default(''),
  type: z.string().optional().default(''),
  assignedUser: z.string().optional().default(''),
  userId: z.string().regex(/^\d*$/, "User ID must be a number.").optional().default(''),
  userType: z.enum(USER_TYPES).optional(),
  owner: z.literal('Group Administrators'),
  status: z.enum(STATUSES),
  notes: z.string().optional().default(''),
  purchaseDate: z.date().optional(),
  warrantyExpirationDate: z.date().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const AssetFormSchema = AssetSchema.omit({ id: true, owner: true }).extend({
  owner: z.string()
});
