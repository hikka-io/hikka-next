import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

import {
    ContentTypeEnum,
    type ReadContentTypeEnum,
    type ReadStatusEnum,
    randomReadNovel,
    randomWatchEntry,
    type WatchStatusEnum,
} from '@hikka/api';
import {
    apiErrorMessage,
    MUTATION_META_SKIP_ERROR_TOAST,
    randomListStatus,
} from '@hikka/core';

import { contentHref } from '@/utils/content-href';

import { countsOf, statusOrder } from '../list-status';
import { type ListContentType, userListStatsOptions } from '../queries';

const EMPTY_LIST_MESSAGE = 'Список пустий';

/**
 * The web's random-title button: a random entry of the open status, opened in-app. The
 * whole list is not a status the endpoints accept, so it picks one in proportion to its entries.
 */
export function useRandomListEntry(
    username: string,
    contentType: ListContentType,
    status: string,
) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        meta: MUTATION_META_SKIP_ERROR_TOAST,
        mutationFn: async () => {
            // Stale counts could name a status emptied elsewhere.
            const stats = await queryClient.ensureQueryData({
                ...userListStatsOptions(username, contentType),
                revalidateIfStale: true,
            });
            const picked = randomListStatus(
                status,
                countsOf(stats),
                statusOrder(contentType),
            );

            if (!picked) throw new Error(EMPTY_LIST_MESSAGE);

            const { data } =
                contentType === ContentTypeEnum.ANIME
                    ? await randomWatchEntry({
                          path: {
                              username,
                              status: picked as WatchStatusEnum,
                          },
                          throwOnError: true,
                      })
                    : await randomReadNovel({
                          path: {
                              username,
                              content_type: contentType as ReadContentTypeEnum,
                              status: picked as ReadStatusEnum,
                          },
                          throwOnError: true,
                      });

            return data;
        },
        onSuccess: (data) => {
            void Haptics.selectionAsync();
            router.push(contentHref(contentType, data.slug));
        },
        onError: (error) => {
            void Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Error,
            );
            toast.error(apiErrorMessage(error, 'Не вдалося обрати тайтл'));
        },
    });
}
