import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
    PaginationArgs,
    SuccessResponse,
} from '../types';
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
    public async createClient(
        args: ClientArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientInfoResponse> {
        return this.client.post<ClientInfoResponse>('/client', args, options);
    }

    /**
     * Get client by reference
     */
    public async getClientByReference(
        reference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientResponse> {
        return this.client.get<ClientResponse>(`/client/${reference}`, options);
    }

    /**
     * Get full client details including secret
     */
    public async getClientFullDetails(
        reference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientInfoResponse> {
        return this.client.get<ClientInfoResponse>(
            `/client/${reference}/full`,
            options,
        );
    }

    /**
     * Get clients list for current user
     */
    public async getClientList(
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientPaginationResponse> {
        return this.client.get<ClientPaginationResponse>('/client', {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Update an existing client
     */
    public async updateClient(
        reference: string,
        args: ClientArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientInfoResponse> {
        return this.client.put<ClientInfoResponse>(
            `/client/${reference}`,
            args,
            options,
        );
    }

    /**
     * Delete a client
     */
    public async deleteClient(
        reference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/client/${reference}`,
            options,
        );
    }

    /**
     * Update client verification status
     */
    public async updateClientVerification(
        reference: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<ClientVerifyResponse> {
        return this.client.post<ClientVerifyResponse>(
            `/client/${reference}/verify`,
            undefined,
            options,
        );
    }
}
