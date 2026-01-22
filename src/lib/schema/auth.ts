import * as z from 'zod';

export const loginSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters.')
			.max(20, 'Username must be at most 20 characters')
			.regex(
				/^[a-zA-Z0-9._-]+$/,
				'Username can only contain letters, numbers, dots, underscores, and hyphens'
			),
		email: z.email('Invalid email'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Password do not match'
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
