import {
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
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>('/settings/description', args);
    }

    /**
     * Change user password
     */
    public async changePassword(args: PasswordArgs): Promise<UserResponse> {
        return this.client.put<UserResponse>('/settings/password', args);
    }

    /**
     * Change username
     */
    public async changeUsername(args: UsernameArgs): Promise<UserResponse> {
        return this.client.put<UserResponse>('/settings/username', args);
    }

    /**
     * Change email
     */
    public async changeEmail(args: EmailArgs): Promise<UserResponse> {
        return this.client.put<UserResponse>('/settings/email', args);
    }

    /**
     * Import watch list
     */
    public async importWatchList(
        args: ImportWatchListArgs,
    ): Promise<SuccessResponse> {
        return this.client.post<SuccessResponse>(
            '/settings/import/watch',
            args,
        );
    }

    /**
     * Import read list
     */
    public async importReadList(
        args: ImportReadListArgs,
    ): Promise<SuccessResponse> {
        return this.client.post<SuccessResponse>('/settings/import/read', args);
    }

    /**
     * Export user lists
     */
    public async exportLists(): Promise<UserExportResponse> {
        return this.client.post<UserExportResponse>('/settings/export');
    }

    /**
     * Get ignored notification types
     */
    public async getIgnoredNotifications(): Promise<IgnoredNotificationsResponse> {
        return this.client.get<IgnoredNotificationsResponse>(
            '/settings/notifications',
        );
    }

    /**
     * Update ignored notification types
     */
    public async updateIgnoredNotifications(
        args: IgnoredNotificationsArgs,
    ): Promise<IgnoredNotificationsResponse> {
        return this.client.put<IgnoredNotificationsResponse>(
            '/settings/notifications',
            args,
        );
    }

    /**
     * Delete user image (avatar or cover)
     */
    public async deleteImage(imageType: ImageType): Promise<UserResponse> {
        return this.client.delete<UserResponse>(`/settings/image/${imageType}`);
    }

    /**
     * Delete user watch list
     */
    public async deleteWatchList(): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>('/settings/watch');
    }

    /**
     * Delete user read list
     */
    public async deleteReadList(
        contentType: ReadDeleteContenType,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(
            `/settings/read/${contentType}`,
        );
    }
}
