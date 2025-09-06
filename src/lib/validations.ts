import { z } from 'zod';

export const operatorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with dashes only'),
  logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tracking_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  launch_year: z.number().min(1990).max(new Date().getFullYear()).optional(),
  verdict: z.string().optional(),
  bonus_terms: z.string().optional(),
  fairness_info: z.string().optional(),
  hero_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
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
});

export type OperatorFormData = z.infer<typeof operatorSchema>;