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
import { apiErrorMessage } from '@hikka/core';

import { useSession } from '@/features/auth';
import {
    invalidateSession,
    invalidateUserProfile,
} from '@/utils/api/invalidate-content-state';

export type ProfileImageType =
    | typeof UploadTypeEnum.AVATAR
    | typeof UploadTypeEnum.COVER;

// The sizes the web crops to (1500x500 cover, 400x400 avatar); the API accepts 200 to 2000 px and 2 MB.
const OUTPUT_WIDTH = { avatar: 400, cover: 1500 } as const;
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

type Picked = { uri: string; width: number; height: number };

// The API takes exactly the web's crop ratios: square avatar, 3:1 cover.
const RATIO = { avatar: 1, cover: 3 } as const;

const prepare = async (type: ProfileImageType, picked: Picked) => {
    const ratio = RATIO[type];
    const width = Math.min(picked.width, picked.height * ratio);
    const height = width / ratio;

    const image = await ImageManipulator.manipulate(picked.uri)
        .crop({
            originX: (picked.width - width) / 2,
            originY: (picked.height - height) / 2,
            width,
            height,
        })
        .resize({ width: OUTPUT_WIDTH[type] })
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
            toast.error(
                apiErrorMessage(
                    error,
                    'Не вдалося завантажити зображення. Спробуйте ще раз.',
                ),
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
            const saved = await prepare(type, asset);

            const file = await (await fetch(saved.uri)).blob();

            upload.mutate({
                path: { upload_type: type },
                body: { file },
                bodySerializer: fileFormData,
            });
        } catch {
            toast.error('Не вдалося обробити зображення.');
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
            toast.error(
                apiErrorMessage(error, 'Не вдалося видалити обкладинку.'),
            );
        },
    });
}
