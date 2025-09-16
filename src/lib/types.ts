
import { z } from 'zod';
import { APP_CONFIG, STATUS_NAMES } from './config';

export const CATEGORY_IDS = ["laptops", "servers", "systems", "networks", "printers", "other"] as const;
export type AssetCategory = (typeof CATEGORY_IDS)[number];


export const AssetSchema = z.object({
  id: z.string(),
  machineName: z.string().min(1, 'Machine name is required'),
  category: z.enum(CATEGORY_IDS),
  os: z.string().optional().nullable(),
  location: z.enum(APP_CONFIG.locations),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  partNumber: z.string().optional().nullable(),
  modelNumber: z.string().optional().nullable(),
  serialNumber: z.string().min(1, 'Serial number is required'),
  type: z.string().optional().nullable(),
  assignedUser: z.string().optional().nullable(),
  userId: z.number().optional().nullable(),
  userType: z.enum(APP_CONFIG.userTypes).optional().nullable(),
  owner: z.literal('Group Administrators'),
  status: z.enum(STATUS_NAMES),
  notes: z.string().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  warrantyExpirationDate: z.coerce.date().optional().nullable(),
  createdBy: z.string().optional().nullable(),
  updatedBy: z.string().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Asset = z.infer<typeof AssetSchema>;

const BaseAssetFormSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
}).extend({
  category: z.enum(CATEGORY_IDS).optional(),
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
});

const refineFunction = (data: z.infer<typeof BaseAssetFormSchema>, ctx: z.RefinementCtx) => {
  if (!data.category) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['category'],
      message: 'Product family is required.',
    });
  }

  const isOsRequired = data.category && !['printers', 'networks', 'other'].includes(data.category);
  if (isOsRequired && (!data.os || data.os.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['os'],
      message: 'OS is required for this product family',
    });
  }
};

// Schema for the frontend form
export const AssetFormSchema = BaseAssetFormSchema.superRefine(refineFunction);
export type AssetFormValues = z.infer<typeof AssetFormSchema>;

// Schemas for the API, with refinements
const CreateApiSchemaBase = BaseAssetFormSchema.extend({
  category: z.enum(CATEGORY_IDS),
  createdBy: z.string(),
  updatedBy: z.string(),
});
export const CreateAssetAPISchema = CreateApiSchemaBase.superRefine(refineFunction);


const UpdateApiSchemaBase = BaseAssetFormSchema.extend({
  category: z.enum(CATEGORY_IDS),
  updatedBy: z.string(),
});
export const UpdateAssetAPISchema = UpdateApiSchemaBase.superRefine(refineFunction);

    
