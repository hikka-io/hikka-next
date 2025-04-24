import { PaginationArgs, SuccessResponse } from '../types';
import {
    ClientArgs,
    ClientInfoResponse,
    ClientPaginationResponse,
    ClientResponse,
    ClientVerifyResponse,
} from '../types/client';
import { BaseModule } from './base';

/**
 * Module for handling API clients
 */
export class ClientModule extends BaseModule {
    /**
     * Create a new client
     */
    public async create(args: ClientArgs): Promise<ClientInfoResponse> {
        return this.client.post<ClientInfoResponse>('/client', args);
    }

    /**
     * Get client by reference
     */
    public async getByReference(reference: string): Promise<ClientResponse> {
        return this.client.get<ClientResponse>(`/client/${reference}`);
    }

    /**
     * Get full client info including secret
     */
    public async getFullClientInfo(
        reference: string,
    ): Promise<ClientInfoResponse> {
        return this.client.get<ClientInfoResponse>(`/client/${reference}/full`);
    }

    /**
     * Get all clients for current user
     */
    public async getAll(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ClientPaginationResponse> {
        return this.client.get<ClientPaginationResponse>('/client', {
            page,
            size,
        });
    }

    /**
     * Update client
     */
    public async update(
        reference: string,
        args: ClientArgs,
    ): Promise<ClientInfoResponse> {
        return this.client.put<ClientInfoResponse>(
            `/client/${reference}`,
            args,
        );
    }

    /**
     * Delete client
     */
    public async delete(reference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/client/${reference}`);
    }

    /**
     * Verify client
     */
    public async verify(reference: string): Promise<ClientVerifyResponse> {
        return this.client.post<ClientVerifyResponse>(
            `/client/${reference}/verify`,
        );
    }
}
