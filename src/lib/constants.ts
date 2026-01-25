import { NODE_ENV } from '$env/static/private';
import { PUBLIC_API_URL } from '$env/static/public';

export const DEFAULT_TIMEOUT = 1000 * 10;

export const BASE_URL = NODE_ENV === 'development' ? '' : PUBLIC_API_URL;
