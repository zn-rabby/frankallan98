import { string, z } from 'zod';

export const createUserZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
          contactNumber: string({ required_error: 'Phone is required' }),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          profile: z.string().optional(),
     }),
});

const updateUserZodSchema = z.object({
     body: z.object({
          name: z.string().optional(),
          contactNumber: z.string().optional(),
          address: z.string().optional(),
          email: z.string().optional(),
          password: z.string().optional(),
          image: z.string().optional(),
     }),
});

export const UserValidation = {
     createUserZodSchema,
     updateUserZodSchema,
};
