import {
    ContentTypeEnum,
    DescriptionArgs,
    EmailArgs,
    IgnoredNotificationsArgs,
    ImageType,
    ImportReadListArgs,
    ImportWatchListArgs,
    PasswordArgs,
    UsernameArgs,
} from '@hikka/client';

// IgnoredNotifications doesn't require any parameters
export interface UseIgnoredNotificationsParams {}

// Profile settings mutation parameters
export interface UseChangeDescriptionParams extends DescriptionArgs {}
export interface UseChangePasswordParams extends PasswordArgs {}
export interface UseChangeUsernameParams extends UsernameArgs {}
export interface UseChangeEmailParams extends EmailArgs {}
export interface UseDeleteImageParams {
    imageType: ImageType;
}

// List settings mutation parameters
export interface UseImportWatchListParams extends ImportWatchListArgs {}
export interface UseImportReadListParams extends ImportReadListArgs {}
export interface UseExportListsParams {}
export interface UseDeleteWatchListParams {}
export interface UseDeleteReadListParams {
    contentType: ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;
}

// Notification settings mutation parameters
export interface UseUpdateIgnoredNotificationsParams
    extends IgnoredNotificationsArgs {}
