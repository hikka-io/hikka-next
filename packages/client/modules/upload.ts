import { ImageResponse, UploadTypeEnum } from '../types/upload';
import { BaseModule } from './base';

/**
 * Module for handling file uploads
 */
export class UploadModule extends BaseModule {
    /**
     * Upload an image
     */
    public async uploadImage(
        uploadType: UploadTypeEnum,
        file: File | Blob,
    ): Promise<ImageResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${this.client.getBaseUrl()}/upload/${uploadType}`;
        const headers: HeadersInit = {};

        // Add auth token if available
        const authToken = this.client.getAuthToken();
        if (authToken) {
            headers['auth'] = authToken;
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
