import {
    useIsMutating,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { toast } from 'sonner-native';

import {
    ContentTypeEnum,
    deleteRead,
    deleteWatch,
    type MainContentTypeEnum,
    type ReadArgs,
    type ReadContentTypeEnum,
    type ReadResponse,
    readAdd,
    type WatchArgs,
    type WatchResponse,
    watchAdd,
} from '@hikka/api';
import { apiErrorMessage, MUTATION_META_SKIP_ERROR_TOAST } from '@hikka/core';

import {
    applyReadDeletion,
    applyReadMutation,
    applyWatchDeletion,
    applyWatchMutation,
} from '@/utils/api/invalidate-content-state';

export const LIST_ENTRY_SAVE_KEY = ['list-entry', 'save'] as const;
export const LIST_ENTRY_DELETE_KEY = ['list-entry', 'delete'] as const;

const SAVE_ERROR = 'Не вдалося оновити список';
const DELETE_ERROR = 'Не вдалося видалити зі списку';

export type SaveVariables = {
    contentType: MainContentTypeEnum;
    slug: string;
    body: WatchArgs | ReadArgs;
};

export type DeleteVariables = {
    contentType: MainContentTypeEnum;
    slug: string;
};

type Options<TData> = {
    onSuccess?: (data: TData) => void;
};

const saveEntry = async ({
    contentType,
    slug,
    body,
}: SaveVariables): Promise<WatchResponse | ReadResponse> => {
    if (contentType === ContentTypeEnum.ANIME) {
        const { data } = await watchAdd({
            path: { slug },
            body: body as WatchArgs,
            throwOnError: true,
        });
        return data;
    }

    const { data } = await readAdd({
        path: { content_type: contentType as ReadContentTypeEnum, slug },
        body: body as ReadArgs,
        throwOnError: true,
    });
    return data;
};

const deleteEntry = async ({ contentType, slug }: DeleteVariables) => {
    if (contentType === ContentTypeEnum.ANIME) {
        await deleteWatch({ path: { slug }, throwOnError: true });
        return;
    }

    await deleteRead({
        path: { content_type: contentType as ReadContentTypeEnum, slug },
        throwOnError: true,
    });
};

const notifyError = (error: unknown, fallback: string) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    toast.error(apiErrorMessage(error, fallback));
};

/** One write for both kinds; `variables.slug` lets a recycled cell ignore another title's pending write. */
export const useSaveListEntry = ({
    onSuccess,
}: Options<WatchResponse | ReadResponse> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: LIST_ENTRY_SAVE_KEY,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        mutationFn: saveEntry,
        onSuccess: (data, { contentType }) => {
            void (contentType === ContentTypeEnum.ANIME
                ? applyWatchMutation(queryClient, data as WatchResponse)
                : applyReadMutation(queryClient, data as ReadResponse));
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
            onSuccess?.(data);
        },
        onError: (error) => notifyError(error, SAVE_ERROR),
    });
};

export const useDeleteListEntry = ({ onSuccess }: Options<void> = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: LIST_ENTRY_DELETE_KEY,
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        mutationFn: deleteEntry,
        onSuccess: (data, { contentType, slug }) => {
            void (contentType === ContentTypeEnum.ANIME
                ? applyWatchDeletion(queryClient, slug)
                : applyReadDeletion(
                      queryClient,
                      contentType as ReadContentTypeEnum,
                      slug,
                  ));
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
            );
            onSuccess?.(data);
        },
        onError: (error) => notifyError(error, DELETE_ERROR),
    });
};

/** Any save for this slug in flight, from any control: a second write would reuse the same snapshot. */
export const useSavePending = (slug: string) =>
    useIsMutating({
        mutationKey: LIST_ENTRY_SAVE_KEY,
        predicate: (mutation) =>
            (mutation.state.variables as SaveVariables | undefined)?.slug ===
            slug,
    }) > 0;
