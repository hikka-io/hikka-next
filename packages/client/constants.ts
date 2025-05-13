import { PaginationArgs } from './types';

export const DEFAULT_PAGINATION: PaginationArgs = { page: 1, size: 15 };

export const API_HOST = process.env.API_HOST || 'https://api.hikka.io';
