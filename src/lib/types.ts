
import { z } from 'zod';
import { CATEGORIES, LOCATIONS, STATUSES, USER_TYPES } from './constants';

export const AssetSchema = z.object({
  id: z.string(),
  machineName: z.string().min(1, 'Machine name is required'),
  category: z.enum(CATEGORIES),
  os: z.string().optional(),
  location: z.enum(LOCATIONS),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  partNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.string().optional().nullable(),
  assignedUser: z.string().optional(),
  userId: z.number().optional().nullable(),
  userType: z.enum(USER_TYPES).optional(),
  owner: z.literal('Group Administrators'),
  status: z.enum(STATUSES),
  notes: z.string().optional(),
  purchaseDate: z.coerce.date().optional().nullable(),
  warrantyExpirationDate: z.coerce.date().optional().nullable(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const AssetFormSchema = AssetSchema.omit({
  id: true,
  owner: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
}).extend({
  owner: z.string(),
  userId: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() !== '') {
        const num = Number(val);
        return isNaN(num) ? val : num;
      }
      if (typeof val === 'number') {
        return val;
      }
      return undefined;
    },
    z.number({ invalid_type_error: 'User ID must be a number' }).optional()
  ),
  purchaseDate: z.coerce.date().optional().nullable(),
  warrantyExpirationDate: z.coerce.date().optional().nullable(),
});

export type AssetFormValues = z.infer<typeof AssetFormSchema>;

export const CreateAssetAPISchema = AssetFormSchema.extend({
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const UpdateAssetAPISchema = AssetFormSchema.extend({
  updatedBy: z.string(),
});
