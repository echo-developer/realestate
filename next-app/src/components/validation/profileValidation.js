import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone_code: z.string().min(1, 'Phone code is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  whatsapp: z.string()
    .regex(/^\d*$/, 'WhatsApp number must contain only digits')
    .optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city_id: z.string().min(1, 'City is required'),
  website_title: z.string().optional(),
  website_url: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  company_name: z.string().optional(),
  license_number: z.string().optional(),
  experience_years: z.string()
    .regex(/^\d+$/, 'Experience must be a number')
    .optional(),
  specialization: z.string().optional(),
  broker_type: z.enum(['Independent', 'Agency', 'Franchise']).optional(),
  business_address: z.string().optional(),
  business_phone: z.string()
    .regex(/^\d+$/, 'Business phone must contain only digits')
    .optional(),
  business_email: z.string().email('Invalid business email').optional(),
  opening_hours: z.string().optional(),
  closing_hours: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  social_media: z.string().optional(),
  rating: z.string()
    .regex(/^[0-5](\.[0-9])?$/, 'Rating must be between 0 and 5')
    .optional(),
});