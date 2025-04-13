import {
    AddEditArgs,
    EditPaginationResponse,
    EditResponse,
    GetEditListArgs,
    UpdateEditArgs,
} from '../types/edit';
import { BaseModule } from './base';

/**
 * Module for handling content edits
 */
export class EditModule extends BaseModule {
    /**
     * Add an edit to content
     */
    public async addEdit<T = any, R = any>(
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
        page: number = 1,
        size: number = 15,
    ): Promise<EditPaginationResponse<T>> {
        return this.client.get<EditPaginationResponse<T>>('/edit', {
            ...args,
            page,
            size,
        });
    }

    /**
     * Approve an edit
     */
    public async approveEdit(editId: number | string): Promise<EditResponse> {
        return this.client.post<EditResponse>(`/edit/${editId}/approve`);
    }

    /**
     * Reject an edit
     */
    public async rejectEdit(
        editId: number | string,
        reason?: string,
    ): Promise<EditResponse> {
        return this.client.post<EditResponse>(`/edit/${editId}/reject`, {
            reason,
        });
    }
}
