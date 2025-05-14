import {
    BaseRequestOptionsArgs,
    DescriptionArgs,
    EmailArgs,
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
    ImageType,
    ImportReadListArgs,
    ImportWatchListArgs,
    PasswordArgs,
    ReadDeleteContenType,
    SuccessResponse,
    UserExportResponse,
    UserResponse,
    UsernameArgs,
} from '../types';
import { BaseModule } from './base';

export class SettingsModule extends BaseModule {
    /**
     * Change user description
     */
    public async changeDescription(
        args: DescriptionArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>(
            '/settings/description',
            args,
            options,
        );
    }

    /**
     * Change user password
     */
    public async changePassword(
        args: PasswordArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>(
            '/settings/password',
            args,
            options,
        );
    }

    /**
     * Change username
     */
    public async changeUsername(
        args: UsernameArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>(
            '/settings/username',
            args,
            options,
        );
    }

    /**
     * Change email
     */
    public async changeEmail(
        args: EmailArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>('/settings/email', args, options);
    }

    /**
     * Import watch list
     */
    public async importWatchList(
        args: ImportWatchListArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.post<SuccessResponse>(
            '/settings/import/watch',
            args,
            options,
        );
    }

    /**
     * Import read list
     */
    public async importReadList(
        args: ImportReadListArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.post<SuccessResponse>(
            '/settings/import/read',
            args,
            options,
        );
    }

    /**
     * Export user lists
     */
    public async exportLists(
        options?: BaseRequestOptionsArgs,
    ): Promise<UserExportResponse> {
        return this.client.post<UserExportResponse>(
            '/settings/export',
            undefined,
            options,
        );
    }

    /**
     * Get ignored notification types
     */
    public async getIgnoredNotifications(
        options?: BaseRequestOptionsArgs,
    ): Promise<IgnoredNotificationsResponse> {
        return this.client.get<IgnoredNotificationsResponse>(
            '/settings/notifications',
            options,
        );
    }

    /**
     * Update ignored notification types
     */
    public async updateIgnoredNotifications(
        args: IgnoredNotificationsArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<IgnoredNotificationsResponse> {
        return this.client.put<IgnoredNotificationsResponse>(
            '/settings/notifications',
            args,
            options,
        );
    }

    /**
     * Delete user image (avatar or cover)
     */
    public async deleteImage(
        imageType: ImageType,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserResponse> {
        return this.client.delete<UserResponse>(
            `/settings/image/${imageType}`,
            options,
        );
    }

    /**
     * Delete user watch list
     */
    public async deleteWatchList(
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>('/settings/watch', options);
    }

    /**
     * Delete user read list
     */
    public async deleteReadList(
        contentType: ReadDeleteContenType,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/settings/read/${contentType}`,
            options,
        );
    }
}
