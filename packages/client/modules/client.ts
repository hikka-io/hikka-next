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
    public async createClient(args: ClientArgs): Promise<ClientInfoResponse> {
        return this.client.post<ClientInfoResponse>('/client', args);
    }

    /**
     * Get client by reference
     */
    public async getClientByReference(
        reference: string,
    ): Promise<ClientResponse> {
        return this.client.get<ClientResponse>(`/client/${reference}`);
    }

    /**
     * Get full client details including secret
     */
    public async getClientFullDetails(
        reference: string,
    ): Promise<ClientInfoResponse> {
        return this.client.get<ClientInfoResponse>(`/client/${reference}/full`);
    }

    /**
     * Get clients list for current user
     */
    public async getClientList(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ClientPaginationResponse> {
        return this.client.get<ClientPaginationResponse>('/client', {
            page,
            size,
        });
    }

    /**
     * Update an existing client
     */
    public async updateClient(
        reference: string,
        args: ClientArgs,
    ): Promise<ClientInfoResponse> {
        return this.client.put<ClientInfoResponse>(
            `/client/${reference}`,
            args,
        );
    }

    /**
     * Delete a client
     */
    public async deleteClient(reference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/client/${reference}`);
    }

    /**
     * Update client verification status
     */
    public async updateClientVerification(
        reference: string,
    ): Promise<ClientVerifyResponse> {
        return this.client.post<ClientVerifyResponse>(
            `/client/${reference}/verify`,
        );
    }
}
