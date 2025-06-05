import { BaseRequestOptionsArgs } from '../types';
import { ImageResponse, UploadTypeEnum } from '../types/upload';
import { BaseModule } from './base';

/**
 * Module for handling file uploads
 */
export class UploadModule extends BaseModule {
    /**
     * Create a new image upload
     */
    public async createImageUpload(
        uploadType: UploadTypeEnum,
        file: File | Blob,
        options?: BaseRequestOptionsArgs,
    ): Promise<ImageResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${this.client.getBaseUrl()}/upload/${uploadType}`;
        let headers: HeadersInit = {};

        // Add auth token if available
        const authToken = this.client.getAuthToken();
        if (authToken) {
            headers['auth'] = authToken;
        }

        // Handle headers
        if (options?.headers) {
            headers = {
                ...headers,
                ...options.headers,
            };
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message ||
                    `Image upload failed with status ${response.status}`,
            );
        }

        return response.json() as Promise<ImageResponse>;
    }
}
