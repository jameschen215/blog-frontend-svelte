import * as z from 'zod';

export const createCommentSchema = z.object({
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Comment must be 500 characters or less')
		.trim()
});

export const updateCommentSchema = z.object({
	content: z
		.string()
		.min(1, 'Content is required')
		.max(500, 'Comment must be 500 characters or less')
		.trim()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
