import { z } from 'zod';

export const operatorSchema = z.object({
  name: z.string().min(1, 'Operator name is required'),
  slug: z.string().min(1, 'URL slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and dashes only'),
  logo_url: z.string().refine((val) => val === '' || z.string().url().safeParse(val).success, 'Must be a valid URL or empty').optional(),
  tracking_link: z.string().refine((val) => val === '' || z.string().url().safeParse(val).success, 'Must be a valid URL or empty').optional(),
  launch_year: z.preprocess(
    (val) => val === '' || val === null || val === undefined || (typeof val === 'number' && isNaN(val)) ? undefined : Number(val),
    z.number().min(1990, 'Launch year must be 1990 or later').max(new Date().getFullYear(), 'Launch year cannot be in the future').optional()
  ),
  verdict: z.string().optional(),
  bonus_terms: z.string().optional(),
  fairness_info: z.string().optional(),
  hero_image_url: z.string().refine((val) => val === '' || z.string().url().safeParse(val).success, 'Must be a valid URL or empty').optional(),
  categories: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  supported_countries: z.array(z.string()).default([]),
  ratings: z.object({
    overall: z.number().min(0).max(10).default(0),
    trust: z.number().min(0).max(10).default(0),
    value: z.number().min(0).max(10).default(0),
    payments: z.number().min(0).max(10).default(0),
    offering: z.number().min(0).max(10).default(0),
    ux: z.number().min(0).max(10).default(0),
    support: z.number().min(0).max(10).default(0),
  }).default({
    overall: 0,
    trust: 0,
    value: 0,
    payments: 0,
    offering: 0,
    ux: 0,
    support: 0,
  }),
  kyc_required: z.boolean().default(false),
  published: z.boolean().default(false),
  publish_status: z.string().optional(),
  scheduled_publish_at: z.string().nullable().optional().transform((val) => val === '' ? null : val),
  // New extended fields
  site_type: z.string().optional(),
  promo_code: z.string().optional(),
  verification_status: z.string().optional(),
  company_background: z.string().optional(),
  performance_metrics: z.record(z.string(), z.any()).optional(),
  prize_info: z.record(z.string(), z.any()).optional(),
  shipping_info: z.record(z.string(), z.any()).optional(),
  support_channels: z.array(z.string()).default([]),
  community_links: z.record(z.string(), z.string()).optional(),
  withdrawal_time_crypto: z.string().optional(),
  withdrawal_time_skins: z.string().optional(),
  withdrawal_time_fiat: z.string().optional(),
});

export type OperatorFormData = z.infer<typeof operatorSchema>;