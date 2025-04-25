import { PaginationArgs } from '../types';
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
    ): Promise<EditResponse<T, R>> {
        return this.client.put<EditResponse<T, R>>(
            `/edit/${args.content_type}/${args.slug}`,
            {
                after: args.after,
                description: args.description,
                auto: args.auto,
            },
        );
    }

    /**
     * Get edit by ID
     */
    public async getEdit<T = any, R = any>(
        editId: number | string,
    ): Promise<EditResponse<T, R>> {
        return this.client.get<EditResponse<T, R>>(`/edit/${editId}`);
    }

    /**
     * Update an existing edit
     */
    public async updateEdit<T = any, R = any>(
        editId: number | string,
        args: UpdateEditArgs<T>,
    ): Promise<EditResponse<T, R>> {
        return this.client.post<EditResponse<T, R>>(`/edit/${editId}/update`, {
            after: args.after,
            description: args.description,
            auto: args.auto,
        });
    }

    /**
     * Get a list of edits
     */
    public async getEditList<T = any>(
        args: GetEditListArgs = {},
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<EditPaginationResponse<T>> {
        return this.client.post<EditPaginationResponse<T>>('/edit', args, {
            page,
            size,
        });
    }

    /**
     * Accept an edit
     */
    public async acceptEdit(editId: number | string): Promise<EditResponse> {
        return this.client.post<EditResponse>(`/edit/${editId}/accept`);
    }

    /**
     * Deny an edit
     */
    public async denyEdit(editId: number | string): Promise<EditResponse> {
        return this.client.post<EditResponse>(`/edit/${editId}/deny`);
    }

    /**
     * Close an edit
     */
    public async closeEdit(editId: number | string): Promise<EditResponse> {
        return this.client.post<EditResponse>(`/edit/${editId}/close`);
    }

    /**
     * Search for non-edited content
     */
    public async getTodoEditList<T = any>(
        args: TodoEditArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<TodoEditResponse<T>> {
        return this.client.get<TodoEditResponse<T>>(
            `/edit/todo/${args.content_type}/${args.todo_type}`,
            {
                page,
                size,
            },
        );
    }
}
