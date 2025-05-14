import { DEFAULT_PAGINATION } from '../constants';
import { BaseRequestOptionsArgs, PaginationArgs } from '../types';
import {
    AddEditArgs,
    EditPaginationResponse,
    EditResponse,
    GetEditListArgs,
    TodoEditArgs,
    TodoEditResponse,
    UpdateEditArgs,
} from '../types/edit';
import { BaseModule } from './base';

/**
 * Module for handling content edits
 */
export class EditModule extends BaseModule {
    /**
     * Create an edit to content
     */
    public async createEdit<T = any, R = any>(
        args: AddEditArgs<T>,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse<T, R>> {
        return this.client.put<EditResponse<T, R>>(
            `/edit/${args.content_type}/${args.slug}`,
            {
                after: args.after,
                description: args.description,
                auto: args.auto,
            },
            options,
        );
    }

    /**
     * Get edit by ID
     */
    public async getEdit<T = any, R = any>(
        editId: number | string,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse<T, R>> {
        return this.client.get<EditResponse<T, R>>(`/edit/${editId}`, options);
    }

    /**
     * Update an existing edit
     */
    public async updateEdit<T = any, R = any>(
        editId: number | string,
        args: UpdateEditArgs<T>,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse<T, R>> {
        return this.client.post<EditResponse<T, R>>(
            `/edit/${editId}/update`,
            {
                after: args.after,
                description: args.description,
                auto: args.auto,
            },
            options,
        );
    }

    /**
     * Get a list of edits
     */
    public async getEditList<T = any>(
        args: GetEditListArgs = {},
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditPaginationResponse<T>> {
        return this.client.post<EditPaginationResponse<T>>('/edit/list', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Accept an edit
     */
    public async acceptEdit(
        editId: number | string,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse> {
        return this.client.post<EditResponse>(
            `/edit/${editId}/accept`,
            undefined,
            options,
        );
    }

    /**
     * Deny an edit
     */
    public async denyEdit(
        editId: number | string,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse> {
        return this.client.post<EditResponse>(
            `/edit/${editId}/deny`,
            undefined,
            options,
        );
    }

    /**
     * Close an edit
     */
    public async closeEdit(
        editId: number | string,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditResponse> {
        return this.client.post<EditResponse>(
            `/edit/${editId}/close`,
            undefined,
            options,
        );
    }

    /**
     * Search for non-edited content
     */
    public async getTodoEditList<T = any>(
        args: TodoEditArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<TodoEditResponse<T>> {
        return this.client.get<TodoEditResponse<T>>(
            `/edit/todo/${args.content_type}/${args.todo_type}`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
