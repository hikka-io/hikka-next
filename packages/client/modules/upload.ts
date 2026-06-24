import { HikkaApiError } from '../errors';
import {
    CreateImageUploadOptions,
    ImageResponse,
    UploadTypeEnum,
} from '../types/upload';
import { BaseModule } from './base';

/**
 * Module for handling file uploads
 */
export class UploadModule extends BaseModule {
    /**
     * Create a new image upload. When `onUploadProgress` is supplied the
     * request runs through XHR (the only browser API that reports upload
     * progress); otherwise it uses fetch.
     */
    public async createImageUpload(
        uploadType: UploadTypeEnum,
        file: File | Blob,
        options?: CreateImageUploadOptions,
    ): Promise<ImageResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${this.client.getBaseUrl()}/upload/${uploadType}`;

        const headers: Record<string, string> = {};
        const authToken = this.client.getAuthToken();
        if (authToken) {
            headers['auth'] = authToken;
        }

        if (options?.onUploadProgress) {
            return this.uploadViaXhr(
                url,
                formData,
                headers,
                options.onUploadProgress,
                options.signal,
            );
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: formData,
            signal: options?.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new HikkaApiError(
                errorData?.message ||
                    `Image upload failed with status ${response.status}`,
                response.status,
                errorData?.code || 'unknown_error',
                errorData,
            );
        }

        return response.json() as Promise<ImageResponse>;
    }

    private uploadViaXhr(
        url: string,
        formData: FormData,
        headers: Record<string, string>,
        onUploadProgress: (percent: number) => void,
        signal?: AbortSignal,
    ): Promise<ImageResponse> {
        return new Promise<ImageResponse>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);

            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    onUploadProgress(
                        Math.round((event.loaded / event.total) * 100),
                    );
                }
            };

            xhr.onload = () => {
                let body: any = null;
                try {
                    body = JSON.parse(xhr.responseText);
                } catch {
                    body = null;
                }

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(body as ImageResponse);
                } else {
                    reject(
                        new HikkaApiError(
                            body?.message ||
                                `Image upload failed with status ${xhr.status}`,
                            xhr.status,
                            body?.code || 'unknown_error',
                            body,
                        ),
                    );
                }
            };

            xhr.onerror = () =>
                reject(
                    new HikkaApiError(
                        'Network error during upload',
                        0,
                        'network_error',
                    ),
                );

            if (signal) {
                if (signal.aborted) {
                    reject(new DOMException('Aborted', 'AbortError'));
                    return;
                }
                signal.addEventListener('abort', () => xhr.abort(), {
                    once: true,
                });
                xhr.onabort = () =>
                    reject(new DOMException('Aborted', 'AbortError'));
            }

            xhr.send(formData);
        });
    }
}
