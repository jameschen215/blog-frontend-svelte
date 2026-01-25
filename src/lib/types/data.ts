export type Role = 'USER' | 'ADMIN';

export interface User {
	id: number;
	username: string;
	email: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	published: boolean;
	authorId: number;
	createdAt: string;
	updatedAt: string;
}

// Post for homepage - /posts
export interface PostWithAuthor extends Post {
	author: Pick<User, 'id' | 'username' | 'role'>;
	_count?: { comments: number; likes: number };
}

// Post for post page - /posts/:postId
export interface PostDetail extends PostWithAuthor {
	comments: CommentWithAuthor[];
	isLikedByCurrentUser: boolean;
}

export interface Comment {
	id: number;
	content: string;
	postId: number;
	authorId: number | null;
	guestName: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CommentWithAuthor extends Comment {
	author: Pick<User, 'id' | 'username' | 'role'> | null;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export type PostsResult = {
	posts: PostWithAuthor[];
	pagination: PaginationMeta;
};

export type UserResult = {
	user: Pick<User, 'id' | 'username' | 'role'>;
	posts: PostWithAuthor[];
	pagination: PaginationMeta;
};

export type PostDetailResult = { post: PostDetail };

export interface CommentCreateInput {
	content: string;
}

export interface AuthResultUser {
	id: number;
	username: string;
	email: string;
	role: Role;
}

export interface AuthResult {
	user: AuthResultUser;
}
