import * as z from 'zod';
import { CONSTANTS } from '$lib/constants';

const { MAX_LENGTH, MIN_LENGTH } = CONSTANTS.COMMENT;

export const createCommentSchema = z.object({
	content: z
		.string()
		.min(MIN_LENGTH, 'Content is required')
		.max(MAX_LENGTH, `Comment must be ${MAX_LENGTH} characters or less`)
		.trim()
});

export const updateCommentSchema = z.object({
	content: z
		.string()
		.min(MIN_LENGTH, 'Content is required')
		.max(MAX_LENGTH, `Comment must be ${MAX_LENGTH} characters or less`)
		.trim()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
