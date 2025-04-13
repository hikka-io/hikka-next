import { SuccessResponse } from '../types';
import {
    ClientArgs,
    ClientCreateResponse,
    ClientResponse,
} from '../types/client';
import { BaseModule } from './base';

/**
 * Module for handling API clients
 */
export class ClientModule extends BaseModule {
    /**
     * Create a new client
     */
    public async create(args: ClientArgs): Promise<ClientCreateResponse> {
        return this.client.post<ClientCreateResponse>('/client/create', args);
    }

    /**
     * Get client by reference
     */
    public async getByReference(reference: string): Promise<ClientResponse> {
        return this.client.get<ClientResponse>(`/client/${reference}`);
    }

    /**
     * Update client
     */
    public async update(
        reference: string,
        args: ClientArgs,
    ): Promise<ClientResponse> {
        return this.client.put<ClientResponse>(`/client/${reference}`, args);
    }

    /**
     * Delete client
     */
    public async delete(reference: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/client/${reference}`);
    }
}
