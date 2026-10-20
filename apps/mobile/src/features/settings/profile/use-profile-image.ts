import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';

import {
    type BodyUploadImage,
    deleteUserImageMutation,
    UploadTypeEnum,
    uploadImageMutation,
} from '@hikka/api';

import { useSession } from '@/features/auth';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';
import { toastApiError } from '@/utils/offline-toast';

import { centredCrop } from './crop-region';

export type ProfileImageType =
    | typeof UploadTypeEnum.AVATAR
    | typeof UploadTypeEnum.COVER;

// The API takes a JPEG: a square avatar of 160 to 1500 px and a cover of exactly 1500x500 (the web's crop sizes), 2 MB at most.
const OUTPUT_SIZE = {
    avatar: { width: 400, height: 400 },
    cover: { width: 1500, height: 500 },
} as const;
const MIN_AVATAR_SIDE = 160;
const JPEG_QUALITY = 0.9;
const FILE_NAME = 'image.jpg';

const SUCCESS_MESSAGE = {
    avatar: 'Ви успішно оновили свій аватар.',
    cover: 'Ви успішно оновили свою обкладинку.',
} as const;

// The generated serializer stringifies anything that is not a string or Blob; the file needs a name for the multipart part.
const fileFormData = (body: unknown) => {
    const data = new FormData();
    data.append('file', (body as BodyUploadImage).file, FILE_NAME);

    return data;
};

const RATIO = { avatar: 1, cover: 3 } as const;

class ImageTooSmallError extends Error {}

// Render first: the rendered image is upright (EXIF applied), so its size is what the crop must use, not the picker's reported size.
const prepare = async (type: ProfileImageType, uri: string) => {
    const upright = await ImageManipulator.manipulate(uri).renderAsync();
    const crop = centredCrop(upright.width, upright.height, RATIO[type]);

    if (type === UploadTypeEnum.AVATAR && crop.width < MIN_AVATAR_SIDE) {
        throw new ImageTooSmallError();
    }

    const image = await ImageManipulator.manipulate(upright)
        .crop(crop)
        .resize(OUTPUT_SIZE[type])
        .renderAsync();

    return image.saveAsync({ format: SaveFormat.JPEG, compress: JPEG_QUALITY });
};

/**
 * Picks a photo and uploads it as the avatar or the cover. The avatar goes through the system crop
 * first; iOS cannot crop to a wide ratio, so the cover takes the middle band of the photo. Both
 * are then cut to the exact ratio the API expects.
 */
export function useProfileImage(type: ProfileImageType) {
    const queryClient = useQueryClient();
    const { user } = useSession();
    const [preparing, setPreparing] = useState(false);

    const upload = useMutation({
        ...uploadImageMutation(),
        onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            toast.success(SUCCESS_MESSAGE[type]);
            invalidateSession(queryClient);
            if (user?.username)
                invalidateUserProfile(queryClient, user.username);
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(
                error,
                'Не вдалося завантажити зображення. Спробуйте ще раз.',
            );
        },
    });

    const pick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: type === UploadTypeEnum.AVATAR,
            aspect: [1, 1],
            quality: 1,
        });

        const asset = result.canceled ? undefined : result.assets[0];
        if (!asset) return;

        setPreparing(true);
        try {
            const saved = await prepare(type, asset.uri);

            const file = await (await fetch(saved.uri)).blob();

            upload.mutate({
                path: { upload_type: type },
                body: { file },
                bodySerializer: fileFormData,
            });
        } catch (error) {
            toast.error(
                error instanceof ImageTooSmallError
                    ? 'Зображення замале: щонайменше 160 пікселів.'
                    : 'Не вдалося обробити зображення.',
            );
        } finally {
            setPreparing(false);
        }
    };

    return { pick, busy: preparing || upload.isPending };
}

export function useDeleteProfileCover() {
    const queryClient = useQueryClient();
    const { user } = useSession();

    return useMutation({
        ...deleteUserImageMutation(),
        onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            invalidateSession(queryClient);
            if (user?.username)
                invalidateUserProfile(queryClient, user.username);
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            toastApiError(error, 'Не вдалося видалити обкладинку.');
        },
    });
}
